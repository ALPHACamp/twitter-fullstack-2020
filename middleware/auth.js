const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()

  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') return next()
  res.redirect('/admin/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
