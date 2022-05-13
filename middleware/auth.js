const { ensureAuthenticated } = require('../_helpers')


const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

module.exports = {authenticated}
