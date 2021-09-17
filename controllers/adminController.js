const db = require('../models')




const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (!req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')

      res.redirect('/admin/signin')
    } else {
      req.flash('success_messages', '成功登入後台！')
      res.redirect('/admin/tweets')
    }
  },
  tweets: (req, res) => {
    return res.render('admin/tweets')
  },

  logOut: (req, res) => {
 
  },
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  deleteTweet: (req, res) => {

  },
  getUsers: (req, res) => {
    return res.render('admin/users')
  }
}



module.exports = adminController