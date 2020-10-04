const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')

const { User, Tweet } = db

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
}, (req, account, password, done) => {
  User.findOne({ where: { account } })
    .then(user => {
      if (!user) return done(null, false, req.flash('error_messages', '帳號不存在'))
      if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_messages', '密碼錯誤'))
      return done(null, user)
    })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' },
      { model: Tweet, as: 'ReplyTweets' }
    ]
  }).then(user => {
    user = user.toJSON()
    return done(null, user)
  })
})

module.exports = passport
