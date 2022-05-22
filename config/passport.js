const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// setup passport strategy
passport.use(new localStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, callback) => {
    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          return callback(null, false, req.flash('error_messages', '帳號或密碼錯誤'))
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return callback(null, false, req.flash('error_messages', '帳號或密碼錯誤'))
        }
        return callback(null, user)
      })
  }
))

// serialize and deserialize user
passport.serializeUser((user, callback) => {
  return callback(null, user.id)
})
passport.deserializeUser((id, callback) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return callback(null, user)
    })
})

module.exports = passport
