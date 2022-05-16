const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt-nodejs')

const { User, Tweet } = require('../models')

// set up Passport strategy

passport.use(
  'user-local',
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, account, password, cb) => {
      const user = await User.findOne({ where: { account } })

      if (!user) {
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤！')
        )
      }

      if (user.role !== 'user') {
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤！')
        )
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤！')
        )
      }

      return cb(null, user)
    }
  )
)

passport.use(
  'admin-local',
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, account, password, cb) => {
      console.log(req.body)
      const user = await User.findOne({ where: { account } })

      if (!user) {
        return cb(
          null,
          false,
          req.flash('error_messages', '查無此帳號請重新輸入！')
        )
      }

      if (user.role !== 'admin') {
        return cb(
          null,
          false,
          req.flash('error_messages', '您不是管理員無法使用此功能')
        )
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤！')
        )
      }

      return cb(null, user)
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
