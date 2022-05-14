// const { User } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    if (!req.user) {
      res.render('admin/signin')
    } else if (req.user.role === 'admin') {
      res.redirect('/admin/tweets')
    } else {
      req.flash('error_messages', '您無此權限！')
      req.logout()
      res.redirect('/admin/signin')
    }
  },
  signIn: (req, res) => {
    if (req.user.role === 'user') {
      req.flash('error_messages', '您無此權限！')
      req.logout()
      res.redirect('/admin/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/admin/tweets')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    res.render('admin/admin_main')
  },
  getUsers: (req, res, next) => {
    res.render('admin/admin_users')
  }

}
module.exports = adminController
