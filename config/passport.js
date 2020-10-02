const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')

const { User,Tweet } = db

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({ where: { email } })
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
      { model: Tweet, as: 'LikedTweets' }
    ]
  }).then(user => {
    user = user.toJSON()
    return done(null, user)
  })
})

module.exports = passport
