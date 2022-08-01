const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Tweet, Like } = require('../models')
const { Op } = require('sequelize')

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, account, password, cb) => {
    User.findOne({
      where: {
        [Op.or]: [
          { account: account },
          { email: account }
        ]
      }
    })
      .then(user => {
        if (!user) {
          return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              // 調整錯誤訊息
              return cb(null, false, req.flash('error_messages', '密碼錯誤！'))
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
      { model: Tweet, include: Like },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
