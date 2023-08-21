// 第三方套件
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')

// 自己的套件
const { User } = require('../models')
// 自己的變數
const JwtStrategy = passportJWT.Strategy
const jwtOption = {
  jwtFromRequest: (req) => { // 從http中直接取出jwt cookie
    let token = null
    if (req && req.cookies) {
      token = req.cookies.jwtToken
    }
    return token
  },
  secretOrKey: process.env.JWT_SECRET
}

const jwtStrategy = new JwtStrategy(jwtOption, async function (jwtPayload, done) {
  try {
    const user = await User.findByPk(jwtPayload.id,
      {
        include: [] // 預留給以後include別的資料
      })
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
})

// 前後端區分我先放在middleware/auth內
const localStrategy = new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  async function (req, account, password, done) {
    try {
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

passport.use(jwtStrategy)
passport.use(localStrategy)
module.exports = passport
