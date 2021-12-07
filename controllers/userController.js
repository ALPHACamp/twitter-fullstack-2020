const bcrypt = require('bcryptjs')
const db = require('../models')
const tweet = require('../models/tweet')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '密碼與檢查密碼不一致！')
      res.redirect('/signup')
    } else {
      return User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            req.flash('error_messages', '這個Email已經註冊過！')
            res.redirect('/signup')
          } else {
            req.flash('success_messages', '註冊成功!')
            return User.create({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => { res.redirect('/signin') })
          }
        })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //使用者個人資料頁面
  getUserTweets: (req, res) => {
    return User.findByPk(req.params.userId, {
      include: Tweet
    })
      .then(user => {
        return res.render('userTweets', {
          user: user.toJSON(),
        })
      })
  },
  //設定使用者個人資料頁面推文與回覆頁面
  getUserReplies: (req, res) => {
    return User.findByPk(req.params.userId, {
      include: [Reply, Tweet]
    })
      .then(user => {
        return res.render('userReplies', {
          user: user.toJSON()
        })
      })
  }
}

module.exports = userController