const bcrypt = require('bcryptjs')
const { Tweet, User, Followship } = require("../models");
const { imgurFileHandler } = require('../helpers/file-helpers')
const randomUsersHelper = require('../helpers/randomUsersHelper');
const userController = {
  signupPage: (req, res) => {
    res.render('signup')
  },
  signup: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    // if (password !== passwordCheck) throw new Error('密碼與確認密碼不相符')
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          throw new Error('Email已經被使用')
        }
        return User.findOne({ where: { account } })
      })
      .then(user => {
        if (user) {
          throw new Error('帳號已經被使用')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hashedPassword => {
        return User.create({
          account,
          name,
          email,
          password: hashedPassword
        })
      })
      .then(() => {
        res.redirect('/signin')
      })
      .catch(err => {
        console.error(err)
      })
  },
  signinPage: (req, res) => {
    res.render('signin')
  },
  sigin: (req, res) => {
    // req.flash('success_messages', '成功登入!')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    // req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
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
      console.log(err)
    }
  },
  getUser: async (req, res, next) => {
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

        res.render('user/user-tweets', dataToRender);
      } else {
        res.status(404).send('未找到用户');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("获取用户数据时出错。");
    }
  },
  getFollower: async (req, res, next) => { // 跟隨者
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

          res.render('user/user-follower', dataToRender);
        } else {
          res.status(404).send('未找到用户');
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
  getFollowing: async (req, res, next) => { // 跟隨中
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

        res.render('user/user-following', dataToRender);
      } else {
        res.status(404).send('未找到用户');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("获取用户数据时出错。");
    }
  },
  putUser: (req, res, next) => { //修改使用者名稱、自我介紹
    const { name, introduction } = req.body
    return User.findByPk(req.params.id)
      .then(user => {
        return user.update({
          name,
          introduction
        })
      })
      .then(() => {
        res.redirect(`/users/${req.params.id}/tweets`)
      })
  }
};

module.exports = userController;