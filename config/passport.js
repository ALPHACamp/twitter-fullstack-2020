const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')
const { Op } = require('sequelize')

passport.use(new LocalStrategy({
  usernameField: 'account',
  passReqToCallback: true
}, (req, username, password, cb) => {
  User.findOne({
    where: {
      [Op.or]: [
        { account: username },
        { email: username }
      ]
    }
  }).then(user => {
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    return cb(null, user)
  })
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweet' }
    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport