const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
    req.flash('error_messages', '管理員無法登入前台!')
    res.redirect('/signin')
  }
  req.flash('error_messages', '請先登入使用者帳號!')
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    req.flash('error_messages', '使用者無法登入後台!')
    res.redirect('/admin/signin')
  }
  req.flash('error_messages', '請先登入管理員帳號!')
  res.redirect('/admin/signin')
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
