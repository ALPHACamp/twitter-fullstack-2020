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
      req.flash('success_messages', 'Sign in successfully！')
      return res.redirect('/')
    }
    req.flash('success_messages', 'permission denied！')
    res.redirect('/signin')
  },
  AdminSignIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('success_messages', 'Sign in successfully！')
      return res.redirect('/')
    }
    req.flash('success_messages', 'permission denied！')
    res.redirect('/signin')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Sign out successfully！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController