const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '後臺帳號不能進入前臺!')
      res.redirect('/admin/tweets')
    }
  } else {
    res.redirect('/signin')
  }
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    if (helpers.getUser(req).role === 'user') {
      req.flash('error_messages', '前臺帳號不能進入後臺!')
      res.redirect('/tweets')
    }
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
