const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply

// FIXME:use helpers.getUser(req) to replace req.user
// FIXME:use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, cb) => {
    User.findOne({ where: { account: username } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號不存在！'))
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '密碼輸入錯誤!'))
        return cb(null, user)
      })
      .catch(err => done(err, false))
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
//TODO:搜尋條件待加入使用者關聯資料語法 i.e.{ model: User, as: 'Followers' }
passport.deserializeUser(async(id, cb) => {
 try{
    await User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' },
    ]
  })
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
 } catch(error){
    console.log(error)
    res.render('new', {Error})}
 
})

module.exports = passport