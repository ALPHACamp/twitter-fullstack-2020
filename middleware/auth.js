const helper = require('../_helpers')

module.exports = {
  authenticated: (req, res, next) => {
    if (helper.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
}