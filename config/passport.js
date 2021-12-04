const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

// setup passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    // authenticate user
    (req, username, password, cb) => {
      User.findOne({ where: { email: username } }).then((user) => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
        if (req.path === '/signin' && user.role !== 'user') return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
        if (req.path === '/admin/signin' && user.role !== 'admin') return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        return cb(null, user)
      })
    }
  )
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      //以id as followingId 來固定 User table 的 followingId, 所以可以找出所有在追蹤*id*的users
      { model: User, as: 'Followers' },
      //以id as followerId 來固定 User table 的 followerId, 所以可以找出*id*在追蹤的所有users
      { model: User, as: 'Followings' },
    ],
  }).then((user) => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport
