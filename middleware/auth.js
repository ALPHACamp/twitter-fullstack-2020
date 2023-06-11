const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).isAdmin) {
      return next()
    }
    req.logOut(() => {})
  }
  req.flash('error_message', '帳號不存在')
  return res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    req.logOut(() => { })
  }
  req.flash('error_message', '帳號不存在')
  return res.redirect('/admin/signin')
}

// 一般使用者不能進後台
// 管理員不能進前台
const authenticatedTweets = (req, res, next) => {
  console.log('進入authtweets')
  if (helpers.ensureAuthenticated(req)) {
    console.log('是使用者')
    if (!helpers.getUser(req).isAdmin) {
      console.log('是user')
      return next()
    } else {
      console.log('是管理員')
      return res.redirect('/admin/tweets')
    }
  }
  return res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedTweets
}
