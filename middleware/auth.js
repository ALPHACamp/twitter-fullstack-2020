const helpers = require('../_helpers')

module.exports = {
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) next()
    return res.redirect('/signin')
  },
  authenticatedAdmin: (rea, res, next) => {
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role) next()
    return res.redirect('/admin/signin')
  }
}