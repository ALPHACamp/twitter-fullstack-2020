const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const error = []

    if (password !== passwordCheck) {
      error.push({ message: '密碼與確認密碼必須相同' })
      return res.render('signup', { account, name, email, errorMessage })
    }

    User.findOne({ where: { $or: [{ email }, { account }] }, raw: true })
      .then(user => {
        if (user) {
          if (user.email === email) { error.push({ message: 'Email已被註冊' }) }
          if (user.account === account) { error.push({ message: '帳號已被使用' }) }
          return res.render('signup', { account, email, name, error })
        }
        if (!user) {
          return User.create({ account, name, email, password: hashPassword })
            .then(() => {
              req.flash('successMessage')
              res.redirect('signin')
            })
        }
      })
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('successMessages', '登入成功')
    res.redirect('/tweets')
  }
}

module.exports = userController