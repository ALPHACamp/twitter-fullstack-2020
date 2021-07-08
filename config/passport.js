const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
<<<<<<< HEAD
const User = db.User


passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))
=======
const { User } = db

passport.use(new LocalStrategy({
  usernameField: 'account',
  passReqToCallback: true
}, (req, username, password, cb) => {
  User.findOne({ where: { account: username } }).then(user => {
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    return cb(null, user)
  })
}))
>>>>>>> feature

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
<<<<<<< HEAD
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
=======
    // include: [
    //   { model: User, as: 'Followers' },
    // ]
>>>>>>> feature
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport
