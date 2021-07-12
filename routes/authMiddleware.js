const { request } = require("../app")

module.exports.authenticated = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.isAdmin ) {
    console.log('user')
    return next()
  }
  res.redirect('/signin')
}

module.exports.authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin ) {
    console.log('admin')
    return next()
  }
  res.redirect('/admin/signin')
}
