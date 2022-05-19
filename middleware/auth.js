const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  req.flash('error_messages', '請先登入帳號')
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') return next()
  req.flash('error_messages', '您無此權限!')
  res.redirect('/admin/signin')
}

const isUser = (req, res, next) => {
  if (helpers.getUser(req).role !== 'admin') {
    res.status(200)
    return next()
  } else {
    req.flash('error_messages', '帳號不存在')
    res.redirect('/admin/tweets')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  isUser
}
