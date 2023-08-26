const bcrypt = require("bcryptjs");
const { Op } = require('sequelize')
const { Tweet, User, Reply, Like, Followship } = require("../models");
const { imgurFileHandler } = require("../helpers/file-helpers");
const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const helpers = require("../_helpers");
const userController = {
  signupPage: (req, res) => {
    res.render("signup");
  },
  signup: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const emailPromise = User.findOne({ where: { email } })
    const accountPromise = User.findOne({ where: { account } })
    let mailMsg = ''
    let accountMsg = ''
    let passwordMsg = ''
    let nameMsg = ''

    // if (!account|| !name|| !email|| !password|| !checkPassword)throw new Error ('所有欄位皆為必填')

    return Promise.all([emailPromise, accountPromise])
      .then(([mailUser, accountUser]) => {
        if (mailUser) {
          mailMsg = '此信箱已被使用'
        }
        if (accountUser) {
          accountMsg = '此帳號已被使用'
        }
        if (password !== checkPassword) {
          passwordMsg = '密碼與確認密碼不相符'
        }
        if (name.length > 50) {
          nameMsg = '字數超出上限！'
        }
        if (mailMsg || accountMsg || passwordMsg || nameMsg) {
          return res.render('signup', { nameMsg, passwordMsg, mailMsg, accountMsg, account, name, email })
        } else {
          bcrypt.hash(password, 10)
            .then(hashedPassword => {
              return User.create({
                account,
                name,
                email,
                password: hashedPassword,
                avatar: process.env.DEFAULT_AVATAR,
                background: process.env.DEFAULT_BACKGROUND
              })
            })
            .then(() => res.redirect('/signin'))
        }
      })
  },
  signinPage: (req, res) => {
    res.render("signin");
  },
  sigin: (req, res) => {
    if (req.user.role === 'admin') {
      req.flash('account_messages', '帳號不存在！')
      res.redirect('/signin')
    }
    // req.flash('success_messages', '成功登入!')
    res.redirect("/tweets");
  },
  logout: (req, res) => {
    // req.flash('success_messages', '登出成功!')
    req.logout();
    res.redirect("/signin");
  },
  postFollow: async (req, res, next) => {
    try {
      const { followingUserId } = req.params;
      const currentUserId = req.user.id;
      const user = await User.findByPk(followingUserId);
      const followship = await Followship.findOne({
        where: { followerId: currentUserId, followingId: followingUserId },
      });
      if (!user) throw new Error("User didn't exist");
      if (followship) throw new Error("You are already following this user!");
      await Followship.create({
        followerId: currentUserId,
        followingId: followingUserId,
      });
      res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  deleteFollow: async (req, res, next) => {
    try {
      const currentUserId = req.user.id;
      const { followingUserId } = req.params;
      const user = await User.findByPk(followingUserId);
      const followship = await Followship.findOne({
        where: { followerId: currentUserId, followingId: followingUserId },
      });
      if (!user) throw new Error("User didn't exist");
      if (!followship) throw new Error("You aren't following this user!");
      await followship.destroy();
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  getUser: async (req, res, next) => {
    const isUser =
      helpers.getUser(req).id === Number(req.params.id) ? true : false;
    try {
      const userId = req.params.id;
      const currentUserId = helpers.getUser(req).id;
      const user = await User.findByPk(userId, {
        include: [{
          model: Tweet, include: [
            { model: User },
            { model: Reply, include: [{ model: Tweet }] },
            { model: Like }
          ],
          order: [["updatedAt", "DESC"]]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
        ]
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req);
        const isFollowed = user.Followers.some((l) => l.id === currentUserId);
        const tweets = user.Tweets.map((tweet) => {
          const replies = tweet.Replies.length;
          const likes = tweet.Likes.length;
          const isLiked = tweet.Likes.some((l) => l.UserId === currentUserId);
          const userAvatar = tweet.User.avatar;
          return {
            tweetId: tweet.id,
            userId: tweet.User.id,
            userAccount: tweet.User.account,
            userName: tweet.User.name,
            text: tweet.description,
            createdAt: tweet.createdAt,
            replies,
            likes,
            isLiked,
            userAvatar
          };
        });

        const dataToRender = {
          user: userData,
          tweets,
          recommend,
          isUser,
          isFollowed
        };

        res.render("user/user-tweets", dataToRender);
      } else {
        res.status(404).send("未找到用户");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("获取用户数据时出错。");
    }
  },
  putUser: (req, res, next) => { //修改使用者名稱、自我介紹
    const { name, introduction } = req.body
    const avatar = req.files ? req.files.avatar : null
    const background = req.files ? req.files.background : null
    User.findByPk(helpers.getUser(req).id)
      .then(async user => {
        const avatarFilePath = avatar ? await imgurFileHandler(avatar[0]) : user.avatar
        const backgroundFilePath = background ? await imgurFileHandler(background[0]) : user.background
        console.log("Avatar File Path:", avatarFilePath);
        console.log("Background File Path:", backgroundFilePath);
        return user.update({
          name,
          introduction,
          avatar: avatarFilePath || user.avatar,
          background: backgroundFilePath || user.background,
        });
      })
      .then(() => {
        res.redirect(`/users/${helpers.getUser(req).id}/tweets`)
      })
      .catch((err) => next(err));
  },
  getFollower: async (req, res, next) => {
    // 跟隨者
    try {
      const userId = req.params.id;
      const currentUserId = helpers.getUser(req).id;
      const user = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers', include: { model: User, as: 'Followers' } },
          { model: User, as: 'Followings' }
        ]
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req);
        const follows = user.Followers.map((e) => {
          const isFollowed = e.Followers.some(f => f.id === helpers.getUser(req).id)
          return {
            id: e.id,
            name: e.name,
            avatar: e.avatar,
            introduction: e.introduction,
            isFollowed
          };
        })
        // const follow = userData.Followers.map((followerUser) => {
        //   return {
        //     id: followerUser.id,
        //     name: followerUser.name,
        //     avatar: followerUser.avatar,
        //     introduction: followerUser.introduction
        //   };
        // });

        const dataToRender = {
          users: userData,
          recommend,
          follows,
        };

        res.render("user/user-follower", dataToRender);
      } else {
        res.status(404).send("未找到用户");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("获取用户数据时出错。");
    }
  },

  getFollowing: async (req, res, next) => {
    // 跟隨中
    try {
      const userId = req.params.id;
      const currentUserId = helpers.getUser(req).id;
      const user = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings', include: { model: User, as: 'Followers' } }
        ]
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req);
        const follows = user.Followings.map((e) => {
          const isFollowed = e.Followers.some(f => f.id === helpers.getUser(req).id)
          return {
            id: e.id,
            name: e.name,
            avatar: e.avatar,
            introduction: e.introduction,
            isFollowed
          };
        })
        const dataToRender = {
          users: userData,
          recommend,
          follows,
        };
        res.render("user/user-following", dataToRender);
      } else {
        res.status(404).send("未找到用户");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("获取用户数据时出错。");
    }
  },
  getSetting: (req, res) => {
    // 取得帳戶設定頁面
    return User.findByPk(helpers.getUser(req).id).then((user) => {
      user = user.toJSON();
      const { name, account, email } = user;
      return res.render("settings", { name, account, email });
    });
  },
  putSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const userId = req.user.id
    const emailPromise = User.findOne({ where: { email, id: { [Op.ne]: userId } } })
    const accountPromise = User.findOne({ where: { account, id: { [Op.ne]: userId } } })
    let mailMsg = ''
    let accountMsg = ''
    let passwordMsg = ''
    let nameMsg = ''

    return Promise.all([emailPromise, accountPromise])
      .then(([mailUser, accountUser]) => {
        if (mailUser) {
          mailMsg = '此信箱已被使用'
        }
        if (accountUser) {
          accountMsg = '此帳號已被使用'
        }
        if (password !== checkPassword) {
          passwordMsg = '密碼與確認密碼不相符'
        }
        if (name.length > 50) {
          nameMsg = '字數超出上限！'
        }
        if (mailMsg || accountMsg || passwordMsg || nameMsg) {
          return res.render('settings', { nameMsg, mailMsg, accountMsg, passwordMsg, account, name, email })
        } else {
          Promise.all([
            User.findByPk(userId),
            bcrypt.hash(password, 10)
          ])
            .then(([user, hashedPassword]) => {
              return user.update({
                account,
                name,
                email,
                password: hashedPassword
              })
            })
            .then(() => {
              res.redirect('/settings')
            })
        }
      })
      .catch((err) => next(err));
  }
};

module.exports = userController;
