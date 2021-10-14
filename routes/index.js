const login = require('./login')
const admin = require('./admin')
const tweets = require('./tweets')
const users = require('./users')
const followships = require('./followships')
const apis = require('./api')
const helpers = require('../_helpers')

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    } else {
      return res.redirect('/signin')
    }
  }

  app.use('/admin', admin)
  app.use('/api', authenticated, apis)
  app.use('/tweets', authenticated, tweets)
  app.use('/users', authenticated, users)
  app.use('/followships', authenticated, followships)
  app.use('/', login)
}