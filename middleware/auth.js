const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && !helpers.getUser(req).isAdmin) return next()

  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).isAdmin) return next()

  res.redirect('/admin/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
