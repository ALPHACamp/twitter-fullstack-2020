module.exports.authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

module.exports.authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticatedAdmin()) {
    return next()
  }
  res.redirect('/admin/signin')
}
