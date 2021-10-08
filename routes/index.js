const login = require('./login')
const admin = require('./admin')
const tweets = require('./tweets')
const followships = require('./followships')
const helpers = require('../_helpers')

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    return res.redirect('/signin')
  }

  app.use('/', login)
  app.use('/admin', admin)
  app.use('/tweets', authenticated, tweets)
  app.use('/followships', authenticated, followships)
}