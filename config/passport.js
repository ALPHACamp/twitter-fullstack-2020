const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, account, password, cb) => {
  try {
    const user = await User.findOne({ where: { account } })
    if (!user) cb(null, false, req.flash('danger_msg', '帳號或密碼錯誤!'))

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) cb(null, false, req.flash('danger_msg', '帳號或密碼錯誤!'))
    return cb(null, user)
  } catch (err) {
    cb(err)
  }
})
)

passport.serializeUser((user, cb) => {
  return cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id,{
      include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' },
    ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    cb(err)
  }
})

module.exports = passport