const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '管理者帳號無法進入使用者平台')
      res.redirect('/admin/tweets')
    }
    if (helpers.getUser(req).role === 'user') return next()
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
