const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
  }
  req.flash('warning_messages', '請先登入才能使用！')
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()

    req.flash('warning_messages', '請先登入才能使用！')
    res.redirect('/admin/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
