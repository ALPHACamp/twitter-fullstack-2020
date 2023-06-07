const helpers = require('../_helpers')

module.exporte = {
  // 前台登入
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated && (!helpers.getUser(req).isAdmin)) next()
    req.flash('error_messages', '帳號不存在')
    return res.redirect('/signin')
  },
  // 後台登入
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated && helpers.getUser(req).isAdmin) next()
    req.flash('error_messages', '帳號不存在')
    return res.redirect('/admin/signin')
  }
}