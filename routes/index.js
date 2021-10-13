const login = require('./login')
const admin = require('./admin')
const tweets = require('./tweets')
const users = require('./users')
const followships = require('./followships')
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User

module.exports = (app) => {
  const authenticated = async (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      const user = await User.findByPk(helpers.getUser(req).id)
      if (user.dataValues.role === 'user') {
        return next()
      }
      return res.redirect('/admin/tweets') 
    } else {
      return res.redirect('/signin')
    }
  }

  app.use('/admin', admin)
  app.use('/tweets', authenticated, tweets)
  app.use('/users', authenticated, users)
  app.use('/followships', authenticated, followships)
  app.use('/', login)
}