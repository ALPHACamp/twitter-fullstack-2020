const helpers = require('../_helpers')

const authenticatedRegular = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'Regular') return next()
    // not Regular
    res.redirect('/admin/tweets') 
  } else {
    res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'Admin') return next()
    // not Admin
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticatedRegular,
  authenticatedAdmin
}
