const helpers = require('../_helpers')

module.exports = {
  authenticatedUser: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role !== 'admin') {
        return next()
      }
      req.flash('success_messages', 'permission denied！')
      res.redirect('/signin')
    }
    req.flash('success_messages', 'Please sign in！')
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      req.flash('success_messages', 'permission denied！')
      res.redirect('/signin')
    }
    req.flash('success_messages', 'Please sign in！')
    res.redirect('/signin')
  }
}