const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User
const Tweet = db.Tweet


const adminController = {

  // admin signin page
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  // admin index page
  getTweets: (req, res) => {
    // 去user資料庫撈出所有user
    // 在撈出所有user的tweets
    // 依序日期排列後
    // 將user的 avatar , name , account , createAt(time) ,  description 傳給前端樣板去渲染
    res.render('admin/tweets')
  },

  //admin signIn
  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  // admin logout
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
}

module.exports = adminController