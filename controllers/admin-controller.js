const { Followship, Like, Reply, Tweet, User } = require('../models')
const adminController = {
  signInPage: (req, res, next) => {
    res.render('admin/admin-signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入後台！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    res.render('admin/admin-tweets')
  },
  deleteTweet: (req, res, next) => {
  },
  getUsers: (req, res, next) => {
  }
}

module.exports = adminController
