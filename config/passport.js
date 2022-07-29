const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')

const { User, Tweet, Like } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, account, password, cb) => {
    User
      .findOne({ where: { account } })
      .then(user => {
        if (!user) {
          return cb(null, false, req.flash('error_messages', '帳號輸入錯誤，或尚未註冊'))
        }
        const result = bcrypt.compareSync(password, user.password)
        if (!result) return cb(null, false, req.flash('error_messages', '輸入密碼錯誤'))
        return cb(null, user)
      })
      .catch(err => cb(err))
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User
    .findByPk(id, {
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    .then(user => cb(null, user?.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
