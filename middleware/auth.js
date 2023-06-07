const { ensureAuthenticated, getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  const isUser = getUser(req)?.role === 'user'
  if (ensureAuthenticated(req)) {
    if (isUser) {
      return next()
    }
    req.flash('error_messages', '管理者無法登入前台!')
    return res.redirect('/signin')
  } else {
    req.flash('error_messages', '請先登入!')
    return res.redirect('/signin')
  }
}

const adminAuthenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'admin') {
      return next()
    }
    req.flash('error_messages', '一般使用者無法登入後台')
    return res.redirect('/signin')
  } else {
    req.flash('error_messages', '請先登入!')
    return res.redirect('/admin/signin')
  }
}

module.exports = {
  authenticated,
  adminAuthenticated
}
