const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// 設定 Passport 本地登入策略 - 前台登入
passport.use('local', new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, account, password, cb) => {
    User.findOne({ where: { account, isAdmin: false } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          }
          return cb(null, user)
        })
      })
      .catch(err => cb(err))
  }
))

// 設定 Passport 本地登入策略 - 後台登入
passport.use('local-admin', new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, account, password, cb) => {
    User.findOne({ where: { account, isAdmin: true } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          }
          console.log()
          return cb(null, user)
        })
      })
      .catch(err => cb(err))
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  console.log('你到序列化了')
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      console.log('你到反序列化了')
      return cb(null, user.toJSON())
    })
    .catch(err => cb(err))
})
module.exports = passport
