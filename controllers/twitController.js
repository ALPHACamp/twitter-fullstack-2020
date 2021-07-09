const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User


const twitController = {
  getTwitters: (req, res) => {
    return res.render('twitters')
  },

  getFollower: (req, res) => {
    return res.render('follower')
  },

  getFollowing: (req, res) => {
    return res.render('following')
  },

  toFollowing: (req, res) => {
    return res.send('toFollowing')
  },

  deleteFollowing: (req, res) => {
    return res.send('deleteFollowing')
  },

  getUser: (req, res) => {
    return res.render('user')
  },

  getUserLike: (req, res) => {
    return res.render('userLike')
  },

  getReplies: (req, res) => {
    return res.render('replyUser')
  },

  toReplies: (req, res) => {
    return res.render('toReplies')
  },

  signin: (req, res) => {
    return res.render('signin')
  },

  toSignin: (req, res) => {
    if (req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/user/self')
    }

  },

  getSignup: (req, res) => {
    res.render('signup')
  },

  toSignup: (req, res) => {
    console.log(req.body)
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  getSetting: (req, res) => {
    res.render('setting')
  },

  putSetting: (req, res) => {
    res.send('putSetting')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }


}
module.exports = twitController