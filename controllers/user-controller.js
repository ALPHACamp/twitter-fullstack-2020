const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const imgur = require('imgur')
const { User } = require('../models')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/users') // 暫時使用
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUsers: (req, res) => {
    return res.render('users')
  },
  getSetting: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('setting', { user })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
