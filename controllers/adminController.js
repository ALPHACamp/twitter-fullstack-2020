const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const adminController = {
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    return res.render('admin/tweets')
  },
  signUpPage: (req, res) => {
    const signup = true
    return res.render('admin/signin', { signup })
  },
  signUp: (req, res) => {
    const { name, account, email } = req.body
    User.create({
      name, account, email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
      is_admin: true
    }).then(() => res.redirect('admin/users'))
  }
}

module.exports = adminController