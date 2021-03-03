const helpers = require('../_helpers')

module.exports = {
  authenticatedUser: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role !== 'admin') {
        return next()
      }
      req.flash('error_messages', '請登入！')
      res.redirect('/signin')
    }
    req.flash('error_messages', '請登入！')
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      req.flash('error_messages', '請登入！')
      res.redirect('/admin/signin')
    }
    req.flash('error_messages', '請登入！')
    res.redirect('/admin/signin')
  }
}
