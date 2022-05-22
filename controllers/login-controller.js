const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { Op } = require('sequelize')

const loginController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (req.user.role === 'admin') {
      req.flash('error_messages', '此帳號不存在！')
      req.logout()
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    }
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, password, email, checkPassword, account } = req.body
    const errors = []
    let nameMessages, accountMessages, emailMessages, passwordMessages, checkPasswordMessages

    if (!name || !password || !email || !checkPassword || !account) {
      errors.push({ message: '所有欄位不能空白！' })
    }
    if (account.length > 50) {
      errors.push({ message: '帳號字數超出上限！' })
      accountMessages = '帳號字數超出上限！'
    }
    if (name.length > 50) {
      errors.push({ message: '名稱字數超出上限！' })
      nameMessages = '名稱字數超出上限！'
    }
    if (password !== checkPassword) {
      errors.push({ message: '密碼 與 確認密碼不相符！' })
      passwordMessages = '密碼 與 確認密碼不相符！'
      checkPasswordMessages = '密碼 與 確認密碼不相符！'
    }
    User.findOne({
      where: { [Op.or]: [{ account }, { email }] }
    })
      .then(user => {
        if (user) {
          errors.push({ message: '帳號 或 email已存在！' })
          if (user.toJSON().account === account && user.toJSON().email === email) {
            accountMessages = '帳號已存在！'
            emailMessages = 'email已存在！'
          } else if (user.toJSON().account === account) {
            accountMessages = '帳號已存在！'
          } else {
            emailMessages = 'email已存在！'
          }
        }
        if (errors.length) {
          return res.render('signup', {
            errors,
            account,
            name,
            email,
            password,
            checkPassword,
            nameMessages,
            accountMessages,
            emailMessages,
            passwordMessages,
            checkPasswordMessages
          })
        }
        bcrypt.hash(password, 10)
          .then(hash => User.create({
            name,
            email,
            account,
            password: hash,
            role: 'user'
          }))
          .then(() => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = loginController
