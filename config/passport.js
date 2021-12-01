const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
  },
  (req, username, password, done) => {
    User.findOne({ where: { email: username} }).then(user  => {
      if (!user) return done(null, false, req.flash('error_msg', '還未註冊喔，請先註冊'))
      if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_msg', ' 帳號或密碼錯誤'))
      return done(null, user)
    })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include:[
      { model: User, as: 'Followers'},
      { model: User, as: 'Followings'}
    ]
  }).then(user => {
    user = user.toJSON()
    return done(null, user)
  })
})

module.exports = passport