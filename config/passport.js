// 第三方套件
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// 自己的套件
const { User } = require('../models')
// 自己的變數
const JwtStrategy = passportJWT.Strategy
const jwtOption = {
  jwtFromRequest: req => { // 從http中直接取出jwt cookie
    let token = null
    if (req && req.cookies.jwtToken) {
      token = req.cookies.jwtToken
    } else {
      token = jwt.sign(req.body, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1s' })
    } // JwtStrategy只能吃Token, 所以生出一個只存在1秒token讓它吃
    return token
  },
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}

const jwtStrategy = new JwtStrategy(jwtOption, async function (req, jwtPayload, done) {
  try {
    let user = null
    if (jwtPayload.id) {
      user = await User.findByPk(jwtPayload.id, { include: [] })
      return done(null, user)
    }

    // 如果是post /signin走這邊
    if (jwtPayload.account && jwtPayload.password) {
      user = await User.findOne({ where: { account: jwtPayload.account } })
      const passwordCorrect = await bcrypt.compare(jwtPayload.password, user.password)

      if (passwordCorrect) {
        return done(null, user)
      } else {
        return done(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
      }
    }
    return done(null, false)
  } catch (error) {
    return done(error, false)
  }
})

// Use Session with localStrategy
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
    const user = await User.findByPk(id)
    return done(null, user.toJSON())
  } catch (error) {
    return done(error, false)
  }
})

module.exports = passport
