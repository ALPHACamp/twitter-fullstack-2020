const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
    req.flash('error_messages', '此帳號為管理者帳號，不得登入前台')
    return res.redirect('/admin/tweets')
  }
  req.flash('error_messages', '請先登入使用者帳密！')
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    req.flash('error_messages', '此帳號為使用者帳號，不得登入後台')
    return res.redirect('/tweets')
  }
  req.flash('error_messages', '請先登入後台管理者帳密！')
  res.redirect('admin/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
