const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return res.redirect('/admin/tweets')
    return next()
  }
  req.flash('warning_messages', '請先登入才能使用！')
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    res.redirect('/')
  } else {
    req.flash('warning_messages', '請從後台登入才能使用！')
    res.redirect('/admin/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
