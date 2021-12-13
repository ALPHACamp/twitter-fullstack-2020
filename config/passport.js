const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      // if (user.isAdmin) return cb(null, false, req.flash('error_messages', '此為admin帳戶，請註冊使用者帳戶'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Tweet, as: 'LikeTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },

    ]
  }).then(user => {
    user = user.toJSON() // 此處與影片示範不同
    return cb(null, user)
  })
})

module.exports = passport
