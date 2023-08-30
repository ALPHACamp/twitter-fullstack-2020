const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
    req.flash('error_messages', '帳號不存在！')
    res.redirect('/signin')
  }
  req.flash('error_messages', '請先登入使用者！')
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    req.flash('error_messages', '帳號不存在！')
    res.redirect('/admin/signin')
  }
  req.flash('error_messages', '請先登入管理員！')
  res.redirect('/admin/signin')
}
const authenticatedTweet = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next()
    req.flash('error_messages', '管理員沒有瀏覽權限！')
    res.redirect('/admin/tweets')
  }
  req.flash('error_messages', '請先登入使用者！')
  res.redirect('/signin')
}
const authenticatedAdminTweet = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    req.flash('error_messages', '使用者沒有瀏覽權限！')
    res.redirect('/tweets')
  }
  req.flash('error_messages', '請先登入管理員！')
  res.redirect('/admin/signin')
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedTweet,
  authenticatedAdminTweet
}
