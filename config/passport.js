const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ where: { email: email } }).then(user => {
      if (!user) { 
        return done(null, false, req.flash('failure_msg', '帳號輸入錯誤')) }
      if (user.password !== password) {
        return done(null, false, req.flash('failure_msg', '密碼輸入錯誤'))
      }
      return done(null, user)
    })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
User.findByPk(id).then(user => {
  user = user.toJSON()
  return done(null, user)
})
})

module.exports = passport