const db = require('../models')




const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (!req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')

      res.redirect('admin/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('signup')
    }
  },
  logOut: (req, res) => {

  },
  getTweets: (req, res) => {

  },
  deleteTweet: (req, res) => {

  },
  getUsers: (req, res) => {

  }
}



module.exports = adminController