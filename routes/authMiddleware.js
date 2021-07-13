const { request } = require("../app")

module.exports.authenticated = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.isAdmin) {
    return next()
  }
  res.redirect('/signin')
}

module.exports.authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next()
  }
  res.redirect('/admin/signin')
}
