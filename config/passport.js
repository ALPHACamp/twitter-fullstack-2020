const passport = require('passport')
const LocalStrategy = require('passport-local')
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
  (req, username, password, cb) => {
    User.findOne({ where: { account: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', 'Account or password is incorrect.'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', 'Account or password is incorrect.'))
      return cb(null, user)
    })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' }
    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport