const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, account, password, done) => {
      try {
        const user = await User.findOne({ where: { account } })

        if (!user) {
          return done(null, false, req.flash('error_messages', '帳號不存在！'))
        }

        if (
          (user.role === 'admin' && !req.url.includes('admin')) ||
          (user.role === 'user' && req.url.includes('admin'))
        ) {
          return done(null, false, req.flash('error_messages', '該帳號未註冊！'))
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, req.flash('error_messages', '密碼錯誤'))
        }

        return done(null, user)
      } catch (err) {
        console.error(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  return done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    return done(null, user.toJSON())
  } catch (err) {
    console.error(err)
  }
})

module.exports = passport
