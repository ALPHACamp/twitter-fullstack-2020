const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { Op } = require('sequelize')

const loginController = {
  signInPage: (req, res) => {
    if (!req.user) {
      res.render('signin')
    } else if (req.user.role === 'admin') {
      req.flash('error_messages', '您無此權限！')
      req.logout()
      res.redirect('/signin')
    } else {
      res.redirect('/tweets')
    }
  },
  signIn: (req, res) => {
    if (req.user.role === 'admin') {
      req.flash('error_messages', '此帳號不存在！')
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
    const { name, password, email, checkPassword, account } = req.body
    if (name.length > 50) throw new Error('名稱請勿超過50個字！')
    if (password !== checkPassword) throw new Error('Passwords do not match!')
    User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
      .then(user => {
        if (user) throw new Error('Account or email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        account,
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
