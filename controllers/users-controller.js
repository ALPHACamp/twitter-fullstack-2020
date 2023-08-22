const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signupPage: (req, res) => {
    res.render('signup')
  },
  signup: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    // if (password !== passwordCheck) throw new Error('密碼與確認密碼不相符')
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          throw new Error('Email已經被使用')
        }
        return User.findOne({ where: { account } })
      })
      .then(user => {
        if (user) {
          throw new Error('帳號已經被使用')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hashedPassword => {
        return User.create({
          account,
          name,
          email,
          password: hashedPassword
        })
      })
      .then(() => {
        res.redirect('/signin')
      })
      .catch(err => {
        console.error(err)
      })
  },
  signinPage: (req, res) => {
    res.render('signin')
  },
  sigin: (req, res) => {
    // req.flash('success_messages', '成功登入!')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    // req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
