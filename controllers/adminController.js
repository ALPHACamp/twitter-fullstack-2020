const db = require('../models')
const User = db.User

const adminControllers = {
  adminLoginPage: (req, res) => {
    return res.render('admin/login', { layout: 'mainLogin' })
  },
  adminLogin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/admin/tweets')
  },
  adminLogout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    return res.redirect('/admin/login')
  },
  adminTweets: (req, res) => {
    return res.render('admin/tweets')
  }
}

module.exports = adminControllers