const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')

passport.use(new localStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: 'true'
  },
  (req, account, password, done) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return done(null, user)
          })
      })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((userId, done) => {
  User.findByPk(userId, {
    include: [
      { model: User, as: 'Followers' }, 
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' }
    ]
  })
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
})

module.exports = passport