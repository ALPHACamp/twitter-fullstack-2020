const helpers = require('../_helpers')

module.exports = {
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
    }
    res.redirect('/admin/signin')
  },

  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return res.redirect('/admin/tweets')
      }
      return next()
    }
    res.redirect('/signin')
  }
}
