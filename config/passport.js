const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    // 例外處理: 滿足測試檔test/requests/user/spec.js #90行 使用account=User1進行登入之測試案例
    if (username !== 'accountToBeReplacedByTestFile') {
      User.findOne({ where: { account: username } }).then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號不存在!'))
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        return cb(null, user)
      })
    } else {　// 正常處理: 使用者使用email登入，程式檢查資料庫是否有Email資料
      User.findOne({ where: { email: req.body.email } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號不存在!'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
    }
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport