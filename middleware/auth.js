const helpers = require('../_helpers')

// const authenticated = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'user') {
//     return next()
//   } else {
//     res.redirect('/signin')
//   }
// }
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
    return next()
  } else {
    res.redirect('/admin/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
