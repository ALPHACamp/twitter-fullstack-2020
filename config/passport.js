const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Like } = require('../models')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, account, password, cb) => {
      User.findOne({ where: { account } }).then(user => {
        if (!user) { return cb(null, false, req.flash('error_messages', '查無此帳號！')) }
        // 後台登入限制
        if (req.url === '/admin/signin' && user.role === 'user') {
          return cb(null, false, req.flash('error_messages', '查無此帳號！'))
        }
        // 前台登入限制
        if (req.url === '/signin' && user.role === 'admin') {
          return cb(null, false, req.flash('error_messages', '查無此帳號！'))
        }
        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            return cb(
              null,
              false,
              req.flash('error_messages', '密碼輸入錯誤！')
            )
          }
          return cb(null, user)
        })
      })
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
// user = user.toJSON()
// console.log('passport_user.toJSON()', user) // debug用
// 加入follower & following 的數量，顯示在個人資料頁
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      // 拿到user.Likes的陣列[UserId:1,TweetId:1] follower & following 的 id 陣列
      { model: Like, attributes: ['UserId', 'TweetId'] },
      { model: User, as: 'Followers', attributes: ['id'] },
      { model: User, as: 'Followings', attributes: ['id'] }
    ]
  })
    .then(user => {
      // console.log('passport_user.toJSON()', user.toJSON())
      return cb(null, user.toJSON())
    })
    .catch(err => cb(err))
})
module.exports = passport
