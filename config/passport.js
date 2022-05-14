const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

passport.use(new LocalStrategy({
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  }, 
  (req, account, password, done) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_messages', '帳號或密碼錯誤'))
        }
        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
          return done(null, false, req.flash('error_messages', '帳號或密碼錯誤'))
        }
          return done(null, user)
        })        
      })      
  }))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
    user = user.toJSON()
    return done(null, user)
  }).catch(err => done(err))
})

module.exports = passport
