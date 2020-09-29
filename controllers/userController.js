const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  registPage: (req, res) => {
    return res.render('regist')
  },

  regist: (req, res) => {
    // confirm password
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/regist')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email, account: req.body.account } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/regist')
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/login')
          })
        }
      })
    }
  },
  logInPage: (req, res) => {
    return res.render('login')
  },

  logIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/main')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/login')
  }
}
module.exports = userController