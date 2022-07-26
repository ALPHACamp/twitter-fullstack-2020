const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    res.redirect('/')
  } else {
    res.redirect('/admin/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
