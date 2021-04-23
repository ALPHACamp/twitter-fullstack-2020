const fs = require('fs')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

let adminController = {
  loginPage: (req, res) => {
    return res.render('admin/login')
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/login')
  },

  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => {
        console.log(tweets)
        return res.render('admin/tweets', { tweets })
      })
  },

  getUser: (req, res) => {
    return res.render('admin/users')
  },


}

module.exports = adminController