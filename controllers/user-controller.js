const bcrypt = require("bcryptjs");
const { Tweet, User, Followship } = require("../models");
const { imgurFileHandler } = require("../helpers/file-helpers");
const randomUsersHelper = require("../helpers/randomUsersHelper");
const helpers = require("../_helpers");
const userController = {
  signupPage: (req, res) => {
    res.render("signup");
  },
  signup: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body;
    // if (password !== passwordCheck) throw new Error('密碼與確認密碼不相符')
    return User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          throw new Error("Email已經被使用");
        }
        return User.findOne({ where: { account } });
      })
      .then((user) => {
        if (user) {
          throw new Error("帳號已經被使用");
        }
        return bcrypt.hash(password, 10);
      })
      .then((hashedPassword) => {
        return User.create({
          account,
          name,
          email,
          password: hashedPassword,
        });
      })
      .then(() => {
        res.redirect("/signin");
      })
      .catch((err) => {
        console.error(err);
      });
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
        const eightRandomUsers = await randomUsersHelper.getEightRandomUsers(req); 

        const dataToRender = {
          user: userData,
          recommend: eightRandomUsers,
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
