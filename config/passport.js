const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const { User, Tweet } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, account, password, done) => {
    User.findOne({
      where: { account }
    })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

        bcrypt.compare(password, user.password)
          .then(result => {
            if (!result) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return done(null, user)
          })
      })
  }
))

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Tweet, as: 'LikeTweets' },
      { model: User, as: 'Followers' }, // 撈出追蹤我的人
      { model: User, as: 'Followings' } // 撈出我追蹤的人
    ]
  })
    .then(user => done(null, user))
    .catch(err => done(err))
})

module.exports = passport
