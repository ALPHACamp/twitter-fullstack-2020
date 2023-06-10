const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  const isUser = helpers.getUser(req)?.role === 'user'
  if (helpers.ensureAuthenticated(req)) {
    if (isUser) {
      return next()
    }
  } else {
    req.flash('error_messages', '請先登入!')
    return res.redirect('/signin')
  }
  req.flash('error_messages', '請先登入!')
  res.redirect('/signin')
}

const adminAuthenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    req.flash('error_messages', '管理者帳號或密碼錯誤!')
    return res.redirect('/admin/signin')
  } else {
    req.flash('error_messages', '請先登入管理者帳號!')
    res.redirect('/admin/signin')
  }
  req.flash('error_messages', '請先登入管理者帳號!')
  res.redirect('/admin/signin')
}

module.exports = {
  authenticated,
  adminAuthenticated
}
