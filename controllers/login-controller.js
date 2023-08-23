const { User } = require('../models')
const bcrypt = require('bcryptjs')
const loginController = {
  signUpPage: (req, res) => {
    return res.render('logins/signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    return Promise.all([User.findOne({ where: { email: req.body.email } }), User.findOne({ where: { account: req.body.account } })])
      .then(([sameEmailUser, sameAccountUser]) => {
        if (sameEmailUser) throw new Error('Email already exists!')
        if (sameAccountUser) throw new Error('Account already exists!')
        if (req.body.name.length > 50) throw new Error('Name length should be equal or less than 50!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user'
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('logins/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    return res.redirect('/signin')
  }
}

module.exports = loginController
