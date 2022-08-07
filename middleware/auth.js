const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '帳號不存在！')
      return res.redirect('/admin/tweets')
    }
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    if (helpers.getUser(req).role === 'user') {
      req.flash('error_messages', '帳號不存在！')
      return res.redirect('/admin/signin')
    }
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
