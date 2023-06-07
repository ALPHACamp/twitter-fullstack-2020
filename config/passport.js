const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

passport.use(
  // 本地登入策略
  new LocalStrategy(
    {
      // 設定變數
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, account, password, cb) => {
      try {
        // 抓取 user
        const user = await User.findOne({ where: { account } })
        // 判斷有無
        if (!user) {
          return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤'))
        }
        const isMatch = await bcrypt.compare(password, user.password)
        // 判斷密碼正確
        if (!isMatch) {
          return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤'))
        }
        // 正確的話就cb
        cb(null, user)
      } catch (err) {
        cb(err)
      }
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id)
    return cb(null, user)
  } catch (err) {
    cb(err)
  }
})

module.exports = passport
