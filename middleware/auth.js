const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
  }
  req.flash('error_messages', '請登入管理者帳號')
  res.redirect('/admin/signin')
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
