const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const { User, Tweet } = require('../models')

// set up Passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate user
    async (req, email, password, cb) => {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤！')
        )
      }
      const submittedPassword = await bcrypt.compare(password, user.password)
      if (!submittedPassword) {
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤！')
        )
      }
      return cb(null, user)
    }
  )
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    cb(err)
  }
})

module.exports = passport
