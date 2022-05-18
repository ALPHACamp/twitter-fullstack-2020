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
    if (!name || !password || !email || !checkPassword || !account) throw new Error('欄位都是必填！')
    if (account.length > 50) throw new Error('帳號 請勿超過50個字！')
    if (name.length > 50) throw new Error('名稱 請勿超過50個字！')
    if (password !== checkPassword) throw new Error('密碼 與 確認密碼不相符！')
    User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
      .then(user => {
        if (user) throw new Error('帳號 或 email已存在！')

        return bcrypt.hash(password, 10)
      })
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
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = loginController
