const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', 'Passwords you entered were inconsistent')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        req.flash('error_messages', 'This email address had already been registered!')
        return res.redirect('/signup')
      }
      User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      }).then(user => {
        req.flash('success_messages', 'Your account had been successfully registered!')
        return res.redirect('/signin')
      })
    })
  },

  accountSetting: (req, res) => {
    if (req.params.user_id !== String(helpers.getUser(req).id)) {
      req.flash('error_messages', '無法編輯其他使用者的資料')
      return res.redirect(`/setting/${helpers.getUser(req).id}`)
    }
    User.findByPk(req.params.user_id)
      .then(user => {
        return res.render('accountSetting', { user: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  // editAccount: (req, res) => {
  //   console.log('hi')
  //   console.log(req.params.user_id)
  //   console.log(String(helpers.getUser(req).id))
  //   console.log('noway')
  //   console.log(req.user.id)
  //   // if (req.params.user_id !== String(helpers.getUser(req).id)) {
  //   //   req.flash('error_messages', '無法編輯其他使用者的資料')
  //   //   return res.redirect(`/users/${helpers.getUser(req).id}`)
  //   // }

  //   User.findByPk(req.params.user_id)
  //     .then(user => {
  //       // console.log(req.user)
  //       return res.render('accountSetting', { user: user })
  //     })
  //     .catch(err => console.log(err))
  // },

  signInPage: (req, res) => {
    return res.render('signIn')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/index')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

}

module.exports = userController