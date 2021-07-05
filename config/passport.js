const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')



passport.use(new LocalStrategy(
  //passport
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    // include: [
    //   { model: Restaurant, as: 'FavoritedRestaurants' },
    // ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport