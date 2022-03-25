const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, done) => {
    User.findOne({ where: { $or: [{ email: username }, { account: username }] }, raw: true })
      .then(user => {
        if (!user) { return done(null, false, req.flash('errorMessage', '帳號尚未註冊')) }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, req.flash('errorMessage', '密碼錯誤'))
        }
        return done(null, user)
      })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' },
    ]
  })
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
})
module.exports = passport






