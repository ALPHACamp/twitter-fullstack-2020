const helpers = require('../_helpers')

module.exports = {
  authenticator: (req, res, next) => {
    // use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    req.flash('warning_messages', '請先登入才能使用。')
    res.redirect('/signin')
  }
}
