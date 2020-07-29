const helpers = require('../_helpers')

module.exports = {
  userAuthenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'user') {
      return next()
    }
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
      req.flash('errorMessage', '管理員請從後台登入')
      //return res.redirect('/signin')
      return res.redirect('/admin/tweets')
    }
    res.redirect('/signin')
  },
  adminAuthenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
      return next()
    }
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'user') {
      req.flash('errorMessage', '非管理員無法進入後台')
      return res.redirect('/admin/signin')
    }
    res.redirect('/signin')
  },
  authenticatedStatus: (req, res, next) => {
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'user') { return res.redirect('/tweets') }
    if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') { return res.redirect('/admin/tweets') }
    next()
  }
}
