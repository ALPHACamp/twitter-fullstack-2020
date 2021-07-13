const { request } = require("../app")

module.exports.authenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    req.flash('error_messages', '請到後台登入！')
  }
  if (req.isAuthenticated() && !req.user.isAdmin) {
    return next()
  } 
  res.redirect('/signin')

}

module.exports.authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.isAdmin) {
    req.flash('error_messages', '請到前台登入！')
  }
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next()
  }
  res.redirect('/admin/signin')
}
