const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userController = {
  signinPage: (req, res) => {
    res.render('signin')
  },
  signupPage: (req, res) => {
    res.render('signup')
  },
  signin: (req, res, next) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/tweets')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: 'user',
          avatar: `https://loremflickr.com/140/140/portrait/?lock=${Math.random() * 100}`,
          cover: `https://loremflickr.com/640/200/landscape/?lock=${Math.random() * 100}`
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
