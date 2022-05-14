const bcrypt = require('bcryptjs')
const { User } = require('../models')

const loginController = {
  signInPage: (req, res) => {
    if (!req.user) {
      res.render('signin')
    } else if (req.user.role === 'admin') {
      req.flash('error_messages', '您無此權限！')
      req.logout()
      res.redirect('/signin')
    } else {
      res.redirect('/')
    }
  },
  signIn: (req, res) => {
    if (req.user.role === 'admin') {
      req.flash('error_messages', '您無此權限！')
      req.logout()
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    }
  },
  signUpPage: (req, res) => {
    if (!req.user) {
      res.render('signup')
    } else {
      req.logout()
      res.redirect('/signup')
    }
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    User.findOne({ where: { account: req.body.account } })
      .then(user => {
        if (user) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        account: req.body.account,
        password: hash,
        role: 'user'
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = loginController
