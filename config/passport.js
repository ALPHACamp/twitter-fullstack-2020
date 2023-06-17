const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Like } = require('../models')
// set up Passport strategy
passport.use(
  'user',
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate user
    (req, account, password, cb) => {
      User.findOne({ where: { account } }).then(user => {
        if (!user) { return cb(null, false, req.flash('error_messages', '帳號尚未註冊！')) }
        bcrypt.compare(password, user.password).then(res => {
          if (!res) { return cb(null, false, req.flash('error_messages', '密碼錯誤！')) }
          return cb(null, user)
        })
      })
    }
  )
)
passport.use(
  'admin',
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate admin
    (req, account, password, cb) => {
      User.findOne({ where: { account, role: 'admin' } }).then(admin => {
        if (!admin) { return cb(null, false, req.flash('error_messages', '此帳號不是admin!')) }
        bcrypt.compare(password, admin.password).then(res => {
          if (!res) { return cb(null, false, req.flash('error_messages', '密碼錯誤！')) }
          return cb(null, admin)
        })
      })
    }
  )
)
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        // 關聯資料
        { model: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    cb(err)
  }
})

module.exports = passport
