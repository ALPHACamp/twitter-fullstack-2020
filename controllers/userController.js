const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', 'Passwords you entered were inconsistent')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        req.flash('error_messages', 'This email address had already been registered!')
        return res.redirect('/signup')
      }
      User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      }).then(user => {
        req.flash('success_messages', 'Your account had been successfully registered!')
        return res.redirect('/signin')
      })
    })
  }
}

module.exports = userController