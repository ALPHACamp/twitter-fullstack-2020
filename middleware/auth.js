const helpers = require('../_helpers')

exports.authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

exports.authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/signin')
}
