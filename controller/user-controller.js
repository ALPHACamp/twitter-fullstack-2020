const bcrypt = require('bcryptjs')
const { User } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup', { url: req.url })
  },
  signUp: (req, res, next) => {
    if (req.body.passwordCheck && req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    return Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([registeredAccount, registeredEmail]) => {
        if (registeredAccount) throw new Error('User already exists!')
        if (registeredEmail) throw new Error('User already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin', { url: req.url })
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '請從後台登入')
      req.logout()
      return res.redirect('/admin/signin')
    }
    req.flash('success_messages', 'Login successfully')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully')
    req.logout()
    res.redirect('/signin')
  }
}
module.exports = userController
