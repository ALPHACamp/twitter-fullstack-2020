const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// FIXME:use helpers.getUser(req) to replace req.user
// FIXME:use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, cb) => {
    User.findOne({ where: { account: username } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
        return cb(null, user)
      })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
//TODO:搜尋條件待加入使用者關聯資料語法 i.e.{ model: User, as: 'Followers' }
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
})

module.exports = passport