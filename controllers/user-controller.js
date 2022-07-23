const bcrypt = require('bcryptjs')

const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')

    User.findOne({
      where: {
        email: req.body.email,
        account: req.body.account
      }
    })
      .then(user => {
        if (user) { // FIXME: 優化使用者體驗，告知是account還是email有誤
          throw new Error('Email or account already exists!')
        }
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
  }

}

module.exports = userController
