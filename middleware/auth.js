const { ensureAuthenticated, getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  console.log(getUser(req).role)
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'user') {
      return next()
    }
    return res.redirect('/signin')
  }
}

const adminAuthenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'admin') {
      return next()
    }
    return res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  adminAuthenticated
}
