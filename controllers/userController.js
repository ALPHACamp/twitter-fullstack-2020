const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User



const userController = {
  getSignup: (req, res) => {
    return res.render('signup', { layout: 'userMain' })
  },

  postSignup: (req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
      req.flash('error_messages', '兩次密碼輸入不符！')
      res.redirect('/users/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '此信箱已註冊過！')
            res.redirect('/users/signup')
          } else {
            User.create({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '註冊成功！')
              return res.redirect('/users/login')
            })
          }
        })
    }
  },

  getLogin: (req, res) => {
    return res.render('userLogin', { layout: 'userMain' })
  },

  postLogin: (req, res) => {
    req.flash('success_messages', '登入成功')
    res.redirect('/')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/users/login')
  }
}

module.exports = userController