const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, confirmpassowrd } = req.body
    if (password !== confirmpassowrd) throw new Error('密碼與密碼確認不相符!')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email }})
    ])
      .then(([account, email]) => {
        if (account) throw new Error('account 已重複註冊！')
        if (email) throw new Error('email 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ account, name, email, password: hash, role: 'user' }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/login')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  }
}

module.exports = userController
