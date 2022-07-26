const { User, Tweet } = require('../models')

const adminController = {
  signinPage: (req, res, next) => {
    res.render('admin_signin')
  },

  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res, next) => {
    Tweet.findAll({ include: User, raw: true, nest: true }).then(tweets => {
      // res.send(tweets)
      res.render('admin_tweets', { tweets })
    })
  },
  getUsers: (req, res, next) => {
    User.findAll({ raw: true }).then(users => {
      // res.send(users)
      res.render('admin_users', { users })
    })
  }
}

module.exports = adminController
