const passport = require('passport');
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use('adminStrategy', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號輸入錯誤'))
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '密碼輸入錯誤！'))
        if (user.role !== 'admin') {
          return cb(null, false, req.flash('error_messages', '身分錯誤'))
        }
        return cb(null, user)
      })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON() // 此處與影片示範不同
      return cb(null, user)
    })
})

module.exports = passport