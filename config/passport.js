const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcyrpt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, account, password, done) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_messages', '帳號尚未註冊!'))
        }
        if (!bcyrpt.compareSync(password, user.password)) {
          return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))
        }
        return done(null, user)
      })
      .catch(error => done(error, false))
  }))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    }).catch(err => done(err, null))
})

module.exports = passport