// const bcrypt = require('bcryptjs')
// const { Tweet, User, Like, Reply } = require('../models')
// const { Op } = require('sequelize')

const adminController = {
  signinPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  getUsers: (req, res) => {
    return res.render('admin/users')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signIn')
  }
}
module.exports = adminController
