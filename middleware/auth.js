const helpers = require('../_helpers')
const ADMIN = 'admin'

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === ADMIN) return res.redirect('/admin/tweets')
    return next()
  }
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === ADMIN) return next()
  }
  return res.redirect('/admin/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
