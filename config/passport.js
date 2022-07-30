const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const helpers = require('../_helpers')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return cb(null, false, req.flash('error_messages', '帳號輸入錯誤！'))
        }
        if (helpers.getUser(req).role === 'admin') {
          return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return cb(null, false, req.flash('error_messages', '密碼輸入錯誤！'))
            }
            return cb(null, user)
          })
      })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
      // { model: Like, as: 'LikedTweet' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(cb)
})

module.exports = passport
