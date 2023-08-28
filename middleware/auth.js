const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
    req.flash('error_messages', '此帳號為管理者帳號，不得登入前台')
    return res.redirect('/admin/tweets')
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    req.flash('error_messages', '此帳號為使用者帳號，不得登入後台')
    return res.redirect('/tweets')
  }
  return res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
