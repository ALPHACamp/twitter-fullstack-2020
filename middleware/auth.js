const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
    res.redirect('/signin')
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    res.redirect('/admin/signin')
  }
  res.redirect('/admin/signin')
}
const authenticatedSelfOnly = (req, res, next) => {
  if (helpers.getUser(req).id === Number(req.params.id)) return next()
  throw new Error('Invalid authorization!')
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedSelfOnly
}
