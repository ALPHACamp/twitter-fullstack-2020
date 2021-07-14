const { request } = require("../app")
const helpers = require('../_helpers')
module.exports.authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).isAdmin) {
    req.flash('error_messages', '請到後台登入！')
  }
  if (helpers.ensureAuthenticated(req) && !helpers.getUser(req).isAdmin) {
    return next()
  }
  res.redirect('/signin')

}

module.exports.authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && !helpers.getUser(req).isAdmin) {
    req.flash('error_messages', '請到前台登入！')
  }
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).isAdmin) {
    return next()
  }
  res.redirect('/admin/signin')
}
