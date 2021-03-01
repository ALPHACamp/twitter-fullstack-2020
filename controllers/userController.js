const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')

const userController = {
  signInPage: (req, res) => {
    return res.render('signin')
  },
  AdminSignInPage: (req, res) => {
    return res.render('adminSignin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role !== 'admin') {
      req.flash('success_messages', '登入成功！')
      res.redirect('/tweets')
    } else {
      req.flash('error_messages', '管理者請從後台登入！')
      res.redirect('/signin')
    }
  },
  AdminSignIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('success_messages', 'Sign in successfully！')
      res.redirect('/admin/tweets')
    } else {
      req.flash('error_messages', '使用者請從前台登入！')
      res.redirect('/admin/signin')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Sign out successfully！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController