const bcrypt = require("bcryptjs");
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
        if (mailMsg || accountMsg || passwordMsg) {
          return res.render('signup', { passwordMsg, mailMsg, accountMsg, account, name, email })
        } else {
          bcrypt.hash(password, 10)
            .then(hashedPassword => {
              return User.create({
                account,
                name,
                email,
                password: hashedPassword
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
      const id = +req.body.id
      if (+helpers.getUser(req).id === id) {
        throw new Error('不得追蹤自己')
      }
      return Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: id
      })
      .then(() => res.redirect('back'))
    //   const { followingUserId } = req.params;
    //   const currentUserId = req.user.id;
    //   const user = await User.findByPk(followingUserId);
    //   const followship = await Followship.findOne({
    //     where: { followerId: currentUserId, followingId: followingUserId },
    //   });
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
      const user = await User.findByPk(userId,{
        include: [{
          model:Tweet,include:[
            {model:User},
            {model:Reply, include:[{model:Tweet}]},
            {model: Like }
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
          user: userData,//這邊剛好命名是user 不是users
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
  getFollower: async (req, res, next) => {
    // 跟隨者
    try {
      const userId = req.params.id;
      const currentUserId = helpers.getUser(req).id;
      const user = await User.findByPk(userId,{
        include:[
          { model: User, as: 'Followers', include: { model: User, as: 'Followers' } },
          { model: User, as: 'Followings' }
        ]
      });

      if (user) {
        const userData = user.toJSON();
        const recommend = await getEightRandomUsers(req); 
        const follows = user.Followers.map((e)=>{
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
      const user = await User.findByPk(userId,{
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
          user: userData,
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
    // 編輯帳戶設定
    const { account, name, email, password, passwordCheck } = req.body;
    if (!name || !email || !password || !account || !passwordCheck)
      throw new Error("所有欄位都是必填。");
    if (password !== passwordCheck) throw new Error("密碼不相同");
    return Promise.all([
      User.findByPk(helpers.getUser(req).id),
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } }),
    ])
      .then(async ([user, emailCheck, accountCheck]) => {
        if (
          accountCheck &&
          Number(accountCheck.id) !== Number(helpers.getUser(req).id)
        )
          throw new Error("帳號已有人註冊");
        if (
          emailCheck &&
          Number(emailCheck.id) !== Number(helpers.getUser(req).id)
        )
          throw new Error("信箱已有人註冊");
        return user.update({
          name,
          account,
          email,
          password: password ? await bcrypt.hash(password, 10) : user.password,
        });
      })
      .then(() => {
        req.flash("success_messages", "帳戶設定編輯成功!");
        return res.redirect("settings");
      })
      .catch((err) => next(err));
  }
};

module.exports = userController;
