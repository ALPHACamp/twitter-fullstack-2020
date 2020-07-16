const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = app => {

  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      User.findOne({ where: { email: username } }).then(user => {
        if (!user) {
          return cb(null, false)
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(null, false)
        }
        return cb(null, user)
      })
    }
  ))
  // serialize and deserialize user
  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  })
  passport.deserializeUser((id, cb) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        return cb(null, user)
      })
      .catch((err) => cb(err))
  })
}