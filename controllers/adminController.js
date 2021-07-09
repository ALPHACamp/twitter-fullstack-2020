const { Tweet, User } = require('../models')

const adminController = {
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants')
  }

  signInPage: (req, res) => {
    return res.render('admin/signin')
  },


  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}
module.exports = adminController
