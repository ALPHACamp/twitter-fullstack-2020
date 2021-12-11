const helpers = require('../_helpers')

module.exports = {
  authenticatedUser: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role !== 'admin') {
        return next()
      }
      req.flash('error_messages', '管理員請使用後台')
      return res.redirect('/admin/tweets')
    }
    req.flash('error_messages', '請登入！')
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      req.flash('error_messages', '請登入正確帳號!')
      return res.redirect('/admin/signin')
    }
    req.flash('error_messages', '請登入！')
    res.redirect('/admin/signin')
  }
}
