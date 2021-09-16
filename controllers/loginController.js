const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.User

const loginController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  }, 

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複！')
              return res.redirect('/signup')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                avatar: 'https://i.pinimg.com/474x/ff/4f/c3/ff4fc37f314916957e1103a2035a11fa.jpg',
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
                role: false
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
            }

          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  }, 

  signIn: (req, res) => {
    if (req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')

      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/')
    }
  },

  logOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = loginController