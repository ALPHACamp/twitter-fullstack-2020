const { User } = require('../models')
const bcrypt = require('bcryptjs')
const loginController = {
  signUpPage: (req, res) => {
    return res.render('logins/signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('密碼不相符!')
    if (name.length > 50) throw new Error('暱稱長度不可超過50個字!')
    if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !passwordCheck.trim()) throw new Error('所有欄位皆要填寫!')

    return Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      .then(([sameEmailUser, sameAccountUser]) => {
        if (sameEmailUser) throw new Error('Email already exists!')
        if (sameAccountUser) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('logins/signin')
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

module.exports = loginController
