const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    console.log(req.body)
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      req.flash('warning_msg', '兩次密碼輸入不同！')
      return res.render('signup', { account, name, email, password })
    }
    User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
      .then(user => {
        req.flash('success_msg', '註冊成功，請登入！')
        return res.redirect('/signin')
      })
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          req.flash('warning_msg', err.errors[0].message)
          return res.render('signup', { account, name, email, password })
        }
        if (err.name === 'SequelizeUniqueConstraintError') {
          if (err.errors[0].path === 'users.account') {
            req.flash('warning_msg', 'Sorry, account name already registered!')
            return res.render('signup', { account, name, email, password })
          } else {
            req.flash('warning_msg', 'Sorry, email already registered!')
            return res.render('signup', { account, name, email, password })
          }
        }
        return res.send(err)
      })
  },
  signInPage: (req, res) => {
    return res.render('signin')
  }
}

module.exports = userController