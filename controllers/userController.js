const user = require("../models/user")
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },

  register: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同，請重新填寫')
      return res.redirect('/register')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'email重複!')
          return res.redirect('/register')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複!')
              return res.redirect('/register')
            } else {
              User.create({
                email: req.body.email,
                name: req.body.name,
                account: req.body.account,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(() => {
                return res.redirect('/login')
              })

            }
          })
        }
      })
    }
  },

  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/login')
  },
  getUser: (req, res) => {
    return res.render('user/userPage')
  }
}

module.exports = userController