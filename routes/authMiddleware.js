const helpers = require('../_helpers')

module.exports.authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && (helpers.getUser(req).role==='admin')) {
    req.flash('error_messages', '請到後台登入！')
  }
  if (helpers.ensureAuthenticated(req) && !(helpers.getUser(req).role==='admin')) {
    return next()
  }
  // if (req.isAuthenticated() && req.user.isAdmin) {
  //   req.flash('error_messages', '請到後台登入！')
  // }
  // if (req.isAuthenticated() && !req.user.isAdmin) {
  //   return next()
  // }
  return res.redirect('/signin')

}

module.exports.authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && (helpers.getUser(req).role==='admin')) {
    return next()
  }
  return res.redirect('/admin/signin')
}

