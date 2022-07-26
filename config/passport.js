const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Tweet, Like } = db

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
      if (!user || user.role !== 'user' || !bcrypt.compareSync(password, user.password)) {
        return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
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
      const user = await User.findOne({ where: { account } })
      if (!user || user.role !== 'admin' || !bcrypt.compareSync(password, user.password)) {
        return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      }
      return cb(null, user)
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Like }
    ]
  }).then(user => {
    cb(null, user.toJSON())
  })
    .catch(err => cb(err))
})

module.exports = passport
