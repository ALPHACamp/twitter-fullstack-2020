const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply


const adminController = {
  getLogin: (req, res) => {
    return res.render('adminLogin', { layout: "userMain"})
  },

  postLogin: (req, res) => {
    res.redirect('/admins')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/admins/login')
  },

  getAdmin: (req, res) => {
    return res.render('admin')
  }
}

module.exports = adminController