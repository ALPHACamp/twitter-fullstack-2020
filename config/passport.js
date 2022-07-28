const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const sortObj = require('../helpers/sortObj')
const { User, Followship } = require('../models')
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
        if (!user) return cb(null, false, req.flash('error_messages', '帳號不存在!'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
// passport.deserializeUser(async (id, cb) => {
//   const topFollower = await Followship.findAndCountAll({
//     group: 'following_id',
//     raw: true,
//     nest: true
//   })
//   const users = []
//   for (let i in topFollower.rows) {
//     const user = await User.findByPk(topFollower.rows[i].followingId, { raw: true })
//     user.followerCounts = topFollower?.count[i].count
//     users.push(user)
//     users.sort(sortObj('followerCounts'))
//   }
//   const user = await User.findByPk(id, { raw: true })
//   user.followers = users
//   return cb(null, user)
// })
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    return cb(null, user.toJSON())
  })
})
module.exports = passport
