const login = require('./login')
const admin = require('./admin')
const tweets = require('./tweets')
const users = require('./users')
const followships = require('./followships')
const helpers = require('../_helpers')

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'user') {
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