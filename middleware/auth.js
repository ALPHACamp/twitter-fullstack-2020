const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '此為管理者帳號，跳轉至後台tweets管理頁面')
      return res.redirect('/admin/tweets')
    } else {
      return next()
    }
  } else {
    return res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  console.log('helpers.getUser(req).role', helpers.getUser(req).role)
  if (helpers.getUser(req).role === 'admin') {
    return next()
  } else {
    req.flash('error_messages', '帳號不存在')
    return res.redirect('/admin/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
