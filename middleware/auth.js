const helpers = require('../_helpers')

module.exports = {
  authenticator: (req, res, next) => {
    // use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    req.flash('warning_messages', '請先登入才能使用。')
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).isAdmin) {
      return next()
    } else {
      res.redirect('/admin/signin')
    }
  }
}
