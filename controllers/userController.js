const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers');

const userController = {
  registerPage: (req, res) => {
    return res.render('register', { layout: 'mainLogin' })
  },
  register: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/users/register')
    } else {
      // confirm unique user
      User.findOne({
        where: {
          $or: [
            { email: req.body.email },
            { account: req.body.account }
          ]
        }
      })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱或賬號重複！')
            return res.redirect('/users/register')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              account: req.body.account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user'
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/users/login')
            })
          }
        })
    }
  },
  loginPage: (req, res) => {
    return res.render('login', { layout: 'mainLogin' })
  },
  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    return res.redirect('/users/login')
  },
  settingsPage: (req, res) => {
    const reqUser = helpers.getUser(req)
    return User.findByPk(reqUser.id).then(user => {
      return res.render('settings', {
        user: user.toJSON()
      })
    })
  }
}

module.exports = userController