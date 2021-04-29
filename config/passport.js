const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passReqToCallback: true
  },
  (req, account, password, cb) => {
    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) {
          return cb(null, false, req.flash('warning_msg', '帳號尚未註冊!'))
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(null, false, req.flash('warning_msg', '帳號密碼輸入錯誤!'))
        }
        return cb(null, user)
      })
      .catch(err => console.log(err))
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
    ]
  })
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
    .catch(err => console.log(err))
})

module.exports = passport