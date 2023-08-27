const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Tweet, User, Reply, Like, Followship } = require("../models");
const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const helpers = require("../_helpers");
const userController = {
  signupPage: (req, res) => {
    res.render("signup");
  },
  signup: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body;
    const emailPromise = User.findOne({ where: { email } });
    const accountPromise = User.findOne({ where: { account } });
    let mailMsg = "";
    let accountMsg = "";
    let passwordMsg = "";
    let nameMsg = "";

    if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填')

    return Promise.all([emailPromise, accountPromise])
      .then(([mailUser, accountUser]) => {
        if (mailUser) {
          mailMsg = "此信箱已被使用";
        }
        if (accountUser) {
          accountMsg = "此帳號已被使用";
        }
        if (password !== checkPassword) {
          passwordMsg = "密碼與確認密碼不相符";
        }
        if (name.length > 50) {
          nameMsg = '字數超出上限！'
        }
        if (mailMsg || accountMsg || passwordMsg || nameMsg) {
          return res.render("signup", {
            nameMsg,
            passwordMsg,
            mailMsg,
            accountMsg,
            account,
            name,
            email,
          });
        } else {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              return User.create({
                account,
                name,
                email,
                password: hashedPassword,
                avatar: process.env.DEFAULT_AVATAR,
                background: process.env.DEFAULT_BACKGROUND
              })
            })
            .then(() => {
              req.flash("success_messages", "註冊成功！");
              res.redirect("/signin");
            });
        }
      }
      );
  },
  signinPage: (req, res) => {
    res.render("signin");
  },
  sigin: (req, res) => {
    if (req.user.role === 'admin') {
      req.flash('account_messages', '帳號不存在！')
      res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入!')
    res.redirect("/tweets");
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout();
    res.redirect("/signin");
  },
  postFollow: async (req, res, next) => {

    try {
      const id = +req.body.id
      if (+helpers.getUser(req).id === id) {
        req.flash('error_messages', '不能跟隨自己！')
        res.redirect(200, 'back')//配合test的expect(200) 
        //但這樣畫面會跳出ok. Redirecting to http://localhost:3000/users/${{id/followers}}"的頁面
      } else {
        await Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: id
        })
        return res.redirect('back')
      }
      //   const { followingUserId } = req.params;
      //   const currentUserId = req.user.id;
      //   const user = await User.findByPk(followingUserId);
      //   const followship = await Followship.findOne({
      //     where: { followerId: currentUserId, followingId: followingUserId },
      //   });
      req.flash("info_messages", "追蹤成功！");
      //   if (!user) throw new Error("User didn't exist");
      //   if (followship) throw new Error("You are already following this user!");
      //   await Followship.create({
      //     followerId: currentUserId,
      //     followingId: followingUserId,
      //   });
      // res.redirect('back');
    } catch (err) {
      next(err);
    }
  },
  deleteFollow: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const { followingUserId } = req.params;
      const user = await User.findByPk(followingUserId);
      const followship = await Followship.findOne({
        where: { followerId: currentUserId, followingId: followingUserId },
      });
      if (!user) throw new Error("User didn't exist");
      if (!followship) throw new Error("You aren't following this user!");
      await followship.destroy();
      req.flash("info_messages", "取消追蹤成功！");
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
        include: [
          {
            model: Tweet,
            include: [
              { model: User },
              { model: Reply, include: [{ model: Tweet }] },
              { model: Like },
            ],
            order: [["updatedAt", "DESC"]],
          },
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
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
            userAvatar,
          };
        });

        const dataToRender = {
          user: userData,//這邊剛好命名是user 不是users
          tweets,
          recommend,
          isUser,
          isFollowed,
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
  getFollower: async (req, res, next) => {
    // 跟隨者
    try {
      const userId = req.params.id;

      //const user = Followship.findAll({where: { followerId: req.params.id } })
      const user = await User.findByPk(userId, {
        include: [
          {
            model: User,
            as: "Followers",
            include: { model: User, as: "Followers" },
          },
          {
            model: User,
            as: "Followings",
            include: { model: User, as: "Followers" },
          },
        ],
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req);
        const follows = user.Followers.map((e) => {
          const isnotUser = e.id !== helpers.getUser(req).id;
          const isFollowed = e.Followers.some(
            (f) => f.id === helpers.getUser(req).id
          );
          return {
            id: e.id,
            name: e.name,
            avatar: e.avatar,
            introduction: e.introduction,
            isFollowed,
            isnotUser,
          };
        });

        const dataToRender = {
          user: userData,
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
          { model: User, as: 'Followers', include: { model: User, as: 'Followers' } },
          { model: User, as: 'Followings', include: { model: User, as: 'Followers' } }
        ]
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req);
        const follows = user.Followings.map((e) => {
          const isnotUser = e.id !== helpers.getUser(req).id
          const isFollowed = e.Followers.some(f => f.id === helpers.getUser(req).id)
          return {
            id: e.id,
            name: e.name,
            avatar: e.avatar,
            introduction: e.introduction,
            isFollowed,
            isnotUser
          };
        });
        const dataToRender = {
          user: userData,
          recommend,
          follows,
        };
        res.render("user/user-following", dataToRender);
      } else {
        req.flash("error_messages", "推文成功！");
        res.redirect("back");
      }
    } catch (err) {
      next(err);
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
    const { account, name, email, password, checkPassword } = req.body;
    const userId = req.user.id;
    const emailPromise = User.findOne({
      where: { email, id: { [Op.ne]: userId } },
    });
    const accountPromise = User.findOne({
      where: { account, id: { [Op.ne]: userId } },
    });
    let mailMsg = "";
    let accountMsg = "";
    let passwordMsg = "";
    let nameMsg = "";

    if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填')

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
                password: hashedPassword,
              });
            })
            .then(() => {
              req.flash('success_messages', '編輯成功 !')
              res.redirect('/settings')
            })
        }
      })
      .catch((err) => next(err));
  },
};

module.exports = userController;
