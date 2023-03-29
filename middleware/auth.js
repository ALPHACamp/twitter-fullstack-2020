const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return res.redirect('/admin/tweets')
    return next()
  }
  res.redirect('/signin')
}
const adminAuthenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  adminAuthenticated
}