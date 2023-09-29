const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Like, Reply, Tweet } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        if (req.originalUrl === '/admin/signin') {
          if (user.dataValues.role !== 'admin') return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        }
        if (req.originalUrl === '/signin') {
          if (user.dataValues.role === 'admin') return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        }
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return cb(null, false, req.flash('error_messages', '密碼輸入錯誤！'))
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
      { model: User, as: 'Followings' },
      { model: Like, as: 'LikedTweets', include: Tweet },
      { model: Reply, include: Tweet },
      { model: Tweet }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
