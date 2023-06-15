const helpers = require('../_helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') {
      return next()
    }
    req.logOut(() => { }) // 是admin就登出
  }
  req.flash('error_messages', '帳號不存在！')
  return res.redirect('/signin')
}
// 後台驗證是不是admin
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    req.logOut(() => { }) // 是一般users就登出
  }
  req.flash('error_messages', '帳號不存在')
  return res.redirect('/admin/signin')
}

// 一般使用者不能進後台
// 管理員不能進前台
const authenticatedTweets = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) { // 有沒有驗證
    // 驗證通過 是使用者
    if (helpers.getUser(req).role === 'user') { // 是一般user
      return next()
    } else { // 是管理員
      return res.redirect('/admin/tweets')
    }
  }
  // 沒通過驗證
  return res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedTweets
}
