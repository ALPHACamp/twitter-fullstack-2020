const helper = require('../_helpers')


const authenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

module.exports = {authenticated}
