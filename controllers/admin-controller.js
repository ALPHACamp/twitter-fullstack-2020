// const { User } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_message', '成功登入')
    res.redirect('/admin/tweets')
  },
  logOut: (req, res) => {
    req.flash('success_message', '成功登出')
    res.redirect('/admin/signin')
  }
}
module.exports = adminController
