const bcrypt = require('bcryptjs')
const { Tweet, User, Followship } = require("../models");
const { imgurFileHandler } = require('../helpers/file-helpers')
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
  // User tweet 頁面 
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('user/user-tweets', {
          users: user.toJSON()
        })
      })
  },
  getFollower: (req, res, next) => { // 跟隨者
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('user/user-follower', {
          users: user.toJSON()
        })
      })
  },
  getFollowing: (req, res, next) => { // 跟隨中
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('user/user-following', {
          users: user.toJSON()
        })
      })
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