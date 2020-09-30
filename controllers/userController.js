const { User } = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { Op } = require('sequelize')

const userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },

  register: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body

    const errors = []

    if (!account || !name || !email || !password || !passwordCheck) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== passwordCheck) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (errors.length) {
      return res.render('register', {
        errors,
        account,
        name,
        email,
        password,
        passwordCheck
      })
    }

    User.findOne({
      where: {
        [Op.or]: [
          { email },
          { account }
        ]
      }
    })
      .then(user => {
        if (user) {
          req.flash('error_messages', '信箱或是帳號重複！')
          return res.redirect('/register')
        }
        User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          return res.redirect('/')
        })
      })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
