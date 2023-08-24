const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (name.length > 50) {
      req.flash('error_messages', '暱稱不得超過50字!')
      return res.render('signup', { account, name, email, password, checkPassword })
    }
    if (password !== checkPassword) {
      req.flash('error_messages', '密碼不相符!')
      return res.render('signup', { account, name, email, password, checkPassword })
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
