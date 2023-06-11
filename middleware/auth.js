const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  const isUser = helpers.getUser(req)?.role === 'user'
  if (helpers.ensureAuthenticated(req)) {
    if (isUser) {
      return next()
    }
    req.flash('error_messages', '請至後台登入!')
    return res.redirect('/signin')
  } else {
    req.flash('error_messages', '請先登入!')
    return res.redirect('/signin')
  }
}

const adminAuthenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    req.flash('error_messages', '請至前台登入!')
    return res.redirect('/admin/signin')
  } else {
    req.flash('error_messages', '請先登入!')
    return res.redirect('/admin/signin')
  }
}

module.exports = {
  authenticated,
  adminAuthenticated
}
