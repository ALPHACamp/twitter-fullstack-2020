const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')

    Promise.all([
      User.findOne({
        where: { email: req.body.email }
      }),
      User.findOne({
        where: { account: req.body.account }
      })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!')
        if (userAccount) throw new Error('Account already exists!')
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
        req.flash('success_messages', '已成功註冊帳號，請登入後使用！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getProfile: (req, res, next) => {
    return User.findByPk(req.params.userId, {
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('profile', { user })
      })
      .catch(err => next(err))
  },

  getUserSetting: (req, res, next) => {
    return res.render('setting', { user: helpers.getUser(req)?.toJSON() })
  }
}

module.exports = userController
