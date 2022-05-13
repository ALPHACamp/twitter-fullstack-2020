const { ensureAuthenticated, getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'admin') {
      return res.redirect('/admin')
    }
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'admin') {
      return next() 
    }
    return res.redirect('/')
  } else {
    return res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
