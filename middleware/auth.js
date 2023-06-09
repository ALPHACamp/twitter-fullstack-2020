const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  const isUser = getUser?.role === 'user'
  if (ensureAuthenticated(req)) {
    if (isUser) return next()
    req.flash('error_messages', '帳號或密碼錯誤!')
    return res.redirect('/signin')
  }
  req.flash('error_messages', '請先登入!')
  res.redirect('/signin')
}

const adminAuthenticated = (req, res, next) => {
  const isUser = getUser?.role === 'admin'
  if (ensureAuthenticated(req)) {
    if (isUser) return next()
    req.flash('error_messages', '管理者帳號或密碼錯誤!')
    return res.redirect('/admin/signin')
  }
  req.flash('error_messages', '請先登入管理者帳號!')
  res.redirect('/admin/signin')
}

module.exports = {
  authenticated,
  adminAuthenticated
}
