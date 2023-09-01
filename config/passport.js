// 第三方套件
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

// Use Session with localStrategy
const localStrategy = new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  async function (req, account, password, done) {
    try {
      // 登入時先清空session
      // 避免user登入後按上一頁，可以用root登入
      req.logout(function (err) {
        if (err) {
          return done(err, null)
        }
      })

      const user = await User.findOne({ where: { account } })

      if (!user) {
        return done(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
      }

      const passwordCorrect = await bcrypt.compare(password, user.password)
      if (!passwordCorrect) {
        return done(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
      }

      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  }
)

passport.use(localStrategy)

// serialize
passport.serializeUser(function (user, done) {
  try {
    return done(null, user.id)
  } catch (error) {
    return done(error, false)
  }
})

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id, {
      raw: true,
      nest: true
    })

    delete user.password

    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
})

module.exports = passport
