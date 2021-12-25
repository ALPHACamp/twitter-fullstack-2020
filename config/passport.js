const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    //console.log('username: ', username)
    User.findOne({ where: { 
      account: username
    } 
    }).then(user => {
      //console.log(req)
      if (!user) return cb(null, false, req.flash('error_messages', '帳號不存在!'))
      // if 輸入的帳號超級嚴格的不等於user.account , return 帳號輸入錯誤
      if (user.account !== username) return cb(null, false, req.flash('error_messages', '帳號輸入錯誤!'))
      // if admin login && role !== admin , return 帳號不存在
      if (req.path === '/admin/signin' && user.role !== 'admin') return cb(null, false, req.flash('error_messages', '帳號不存在!'))
      // if normal login && role !== normal , return 無法進入此頁面
      if (req.path === '/signin' && user.role !== 'normal') return cb(null, false, req.flash('error_messages', '無法進入此頁面!'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '密碼輸入錯誤'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id , {
    include: [
      { model: Tweet, as: 'LikedTweets'},
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport