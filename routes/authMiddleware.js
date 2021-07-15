const helpers = require('../_helpers')

module.exports.authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
    req.flash('error_messages', '管理者無法使用前台頁面')
    return res.redirect('/admin/tweets')
  }
  if (helpers.ensureAuthenticated(req) && (helpers.getUser(req).role !== 'admin')) {
    return next()
  }
  return res.redirect('/signin')

}

module.exports.authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && (helpers.getUser(req).role !== 'admin')) {
    req.flash('error_messages', '一般使用者無法使用後台頁面')
    return res.redirect('/tweets')
  }
  if (helpers.ensureAuthenticated(req) && (helpers.getUser(req).role === 'admin')) {
    return next()
  }
  return res.redirect('/admin/signin')
}
