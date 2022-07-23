// 登入、註冊、登出、拿到編輯頁、送出編輯
const bcrypt = require('bcryptjs')
// const db = require('../models')
// const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  }
}
module.exports = userController
