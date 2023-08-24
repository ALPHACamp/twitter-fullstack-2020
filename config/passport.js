const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')


// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        if (req.route.path === '/signin' && user.toJSON().role === 'admin') return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        if (req.route.path === '/admin/signin' && user.toJSON().role === 'user') return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        if (!user) return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號不存在！'))
          return cb(null, user)
        })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
