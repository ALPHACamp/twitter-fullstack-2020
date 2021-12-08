const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

passport.use('user-local', new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true 
  },
  (req, username, password, done) => {
    User.findOne({ where: { account: username, role: 'user'} }).then(user  => {
      console.log(user)
      if (!user) return done(null, false, req.flash('error_msg', '帳號不存在'))
      if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_msg', ' 密碼錯誤'))
      return done(null, user)
    })
  }
))

passport.use('admin-local', new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, done) => {
    User.findOne({ where: { account: username, role: 'admin' } }).then(user => {
      console.log(user)
      if (!user) return done(null, false, req.flash('error_msg', '帳號不存在'))
      if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_msg', ' 密碼錯誤'))
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
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    user = user.toJSON()
    return done(null, user)
  })
})

module.exports = passport