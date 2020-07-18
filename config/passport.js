const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User
const Tweet = db.Tweet

passport.use(new LocalStrategy(
  { usernameField: 'email', passReqToCallback: true },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_messages', '此帳號尚未註冊！'))
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, req.flash('error_messages', '密碼錯誤，請重新輸入！'))
        }
        return done(null, user)
      })
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      Tweet,
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
    .catch((err) => done(err))
})

module.exports = passport
