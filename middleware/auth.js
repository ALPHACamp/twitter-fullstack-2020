const helpers = require('../_helpers')

module.exports = {
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'user') {
        return next()
      } else {
        req.flash('danger_msg', '帳號不存在')
        return res.redirect('/signin')
      }
    }
    req.flash('danger_msg', '使用前請先登入')
    return res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      } else {
        req.flash('danger_msg', '帳號不存在')
        return res.redirect('/signin')
      }
    }
    req.flash('danger_msg', '使用前請先登入')
    return res.redirect('/signin')
  }
}