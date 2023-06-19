const helpers = require('../_helpers')

module.exports = {
  authenticator: (req, res, next) => {
    // use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return res.redirect('/admin/tweets')
      } else if (helpers.getUser(req).role === 'user') {
        return next()
      }
    }
    req.flash('warning_messages', '請先登入才能使用。')
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
      return next()
    } else {
      res.redirect('/admin/signin')
    }
  }
}
