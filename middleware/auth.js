const helpers = require('../_helpers')

module.exports = {
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req) && (helpers.getUser(req).role === 'user')) return next()
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req) && (helpers.getUser(req).role === 'admin')) return next()
    res.redirect('/admin/signin')
  }
}