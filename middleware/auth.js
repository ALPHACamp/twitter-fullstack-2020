const helpers = require('../_helpers')

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') throw new Error('Permission denied')
    if (helpers.getUser(req).role === 'admin') return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
const authenticatedUser = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') throw new Error('Need a user account to continue')
    if (helpers.getUser(req).role === 'user') return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = { authenticatedUser, authenticatedAdmin }
