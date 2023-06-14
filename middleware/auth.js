const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  const role = helpers.getUser(req)?.role
  if (helpers.ensureAuthenticated(req)) {
    if (role === 'user') {
      return next()
    } else if (role === 'admin') {
      return res.redirect('/admin/tweets')
    } else {
      req.flash('error_messages', '帳號或密碼錯誤！')
      return res.redirect('/signin')
    }
  } else {
    req.flash('warning_messages', '請先登入！')
    return res.redirect('/signin')
  }
}

const adminAuthenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    req.flash('error_messages', '管理者帳號或密碼錯誤！')
    return res.redirect('/admin/signin')
  } else {
    req.flash('warning_messages', '請先登入管理者帳號！')
    return res.redirect('/admin/signin')
  }
}

module.exports = {
  authenticated,
  adminAuthenticated
}
