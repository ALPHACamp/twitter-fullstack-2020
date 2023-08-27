const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '管理者不能造訪前台頁面')
      return res.redirect('/admin/tweets')
    }
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
    return next()
  }
  res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}