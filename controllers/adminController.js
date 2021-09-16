const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signIn')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin_main')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin')
  },
}

module.exports = adminController