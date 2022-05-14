const helpers = require('../_helpers')


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

module.exports = {authenticated}
