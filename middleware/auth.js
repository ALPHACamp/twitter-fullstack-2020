const { ensureAuthenticated, getUser } = require('../_helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    if (!getUser(req).isAdmin) return next()
    res.redirect('/')
  }
  res.redirect('/signin')
}
const adminAuthenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin || getUser(req).role) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  adminAuthenticated
}