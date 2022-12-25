const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  // admin
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
    req.flash('error_messages', 'admin無法登入前台，已跳轉到後台頁面。')
    return res.redirect('/admin/tweets')
  }
  // user
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role !== 'admin') {
    return next()
  }
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role !== 'admin') {
    req.flash('error_messages', '無權限登入後台，已跳轉到 Alphitter 首頁。')
    return res.redirect('/tweets')
  }
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
    return next()
  }
  return res.redirect('/admin/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
