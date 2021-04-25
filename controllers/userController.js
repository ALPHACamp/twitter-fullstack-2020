const fs = require('fs')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

let userController = {
  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/login')
  },


  registerPage: (req, res) => {
    return res.render('register')
  },
  userRegister: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/register')
    }
    else {
      // confirm unique account
      User.findOne({ where: { account: req.body.account } }).then(user => {
        if (user) {
          req.flash('error_messages', '帳號重複！')
          return res.redirect('/register')
        }
        else {
          // confirm unique user
          User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) {
              req.flash('error_messages', '信箱重複！')
              return res.redirect('/register')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
                image: null
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/login')
              })
            }
          })

        }

      })
    }
  },

  settingPage: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('setting', {
          user: user.toJSON()
        })
      })
  },
  
  getUser: (req, res) => {

    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profile', {
          user: user.toJSON()
        })
      })
  },

}

module.exports = userController