const helpers = require('../_helpers')

module.exports = {
  authenticatedGeneral: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (!helpers.getUser(req).isAdmin) {
        return next()
      }
      req.flash('error_messages', '此帳號為管理員帳號，無法登入前台')
      return res.redirect('/admin/signin')
    }
    req.flash('error_messages', '請登入')
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next()
      }
      req.flash('error_messages', '此帳號非管理員帳號，無法登入後台')
      return res.redirect('/signin')
    }
    req.flash('error_messages', '請登入！')
    res.redirect('/admin/signin')
  }
}
