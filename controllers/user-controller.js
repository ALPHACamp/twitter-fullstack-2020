const bcrypt = require("bcryptjs");
const { Op } = require('sequelize')
const { Tweet, User, Followship } = require("../models");
const { imgurFileHandler } = require("../helpers/file-helpers");
const randomUsersHelper = require("../helpers/randomUsersHelper");
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
      console.log(err);
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
      console.log(err);
      // next(err)
    }
  },
  getUser: async (req, res, next) => {
    const isUser =
      helpers.getUser(req).id === Number(req.params.id) ? true : false;
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);

      if (user) {
        const userData = user.toJSON();
        const tenRandomUsers = await randomUsersHelper.getTenRandomUsers(10); // 使用 helper 模块获取10个随机用户

        const dataToRender = {
          user: userData,
          recommend: tenRandomUsers,
          isUser,
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
  putUser: (req, res, next) => {
    //修改使用者名稱、自我介紹
    const { name, introduction } = req.body;
    const avatar = req.files ? req.files.avatar : null;
    const background = req.files ? req.files.background : null;
    User.findByPk(req.params.id)
      .then(async (user) => {
        const avatarFilePath = avatar
          ? await imgurFileHandler(avatar[0])
          : user.avatar;
        const backgroundFilePath = background
          ? await imgurFileHandler(background[0])
          : user.background;
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
        res.redirect(`/users/${req.params.id}/tweets`);
      })
      .catch((err) => next(err));
  },
  getFollower: async (req, res, next) => {
    // 跟隨者
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);

      if (user) {
        const userData = user.toJSON();
        const tenRandomUsers = await randomUsersHelper.getTenRandomUsers(10); // 使用 helper 模块获取10个随机用户

        const dataToRender = {
          users: userData,
          recommend: tenRandomUsers,
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
      const user = await User.findByPk(userId);

      if (user) {
        const userData = user.toJSON();
        const tenRandomUsers = await randomUsersHelper.getTenRandomUsers(10); // 使用 helper 模块获取10个随机用户

        const dataToRender = {
          users: userData,
          recommend: tenRandomUsers,
        };

        res.render("user/user-follower", dataToRender);
      } else {
        res.status(404).send("未找到用户");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("获取用户数据时出错。");
    }
    // return User.findByPk(req.params.id)
    //   .then(user => {
    //     return res.render('user/user-follower', {
    //       users: user.toJSON()
    //     })
    //   })
  },
  getFollowing: async (req, res, next) => {
    // 跟隨中
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);

      if (user) {
        const userData = user.toJSON();
        const tenRandomUsers = await randomUsersHelper.getTenRandomUsers(10); // 使用 helper 模块获取10个随机用户

        const dataToRender = {
          users: userData,
          recommend: tenRandomUsers,
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

    return Promise.all([emailPromise, accountPromise])
      .then(([mailUser, accountUser]) => {
        console.log('---------開始一堆if----------')
        if (mailUser) {
          console.log('if>此信箱已被使用')
          mailMsg = '此信箱已被使用'
        }
        if (accountUser) {
          console.log('if>此帳號已被使用')
          accountMsg = '此帳號已被使用'
        }
        if (password !== checkPassword) {
          console.log('if>密碼與確認密碼不相符')
          passwordMsg = '密碼與確認密碼不相符'
        }
        if (mailMsg || accountMsg || passwordMsg) {
          console.log('達到if條件  準備返回')
          return res.render('settings', { mailMsg, accountMsg, passwordMsg, account, name, email })
        } else {
          console.log('----------判斷完了一堆if------------')
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
              console.log('!!!!!-------最後一個then-------!!!!!')
              res.redirect('/settings')
            })
        }
      })
  },

  putUser: (req, res, next) => {
    //修改使用者名稱、自我介紹
    const { name, introduction } = req.body;
    return User.findByPk(req.params.id)
      .then((user) => {
        return user.update({
          name,
          introduction,
        });
      })
      .then(() => {
        res.redirect(`/users/${req.params.id}/tweets`);
      });
  },
};

module.exports = userController;
