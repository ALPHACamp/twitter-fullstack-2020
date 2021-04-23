const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet } = db

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, done) => {
      User.findOne({ where: { $or: [{ email: username }, { account: username }] }, raw: true })
        .then(user => {
          if (!user) {
            return done(null, false, req.flash('error_messages', ' That account is not registered !'))
          }
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                return done(null, false, req.flash('error_messages', ' Account or Password incorrect !'))
              }
              return done(null, user)
            })
        })
        .catch(err => {
          done(err, false)
        })
    }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id, {
      include: [
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        user = user.toJSON()
        return done(null, user)
      }).catch(err => done(err, null))
  })
}
