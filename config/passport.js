const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

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

passport.deserializeUser(async (id, cb) => {
  try {
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
  } catch (error) {
    console.log(error)
    res.render('new', { Error })
  }
})

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' },
    ]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport