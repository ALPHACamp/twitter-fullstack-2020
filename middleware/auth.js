const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') { return next() } //是 user 往下走
    else if (helpers.getUser(req).role === 'admin') {
      res.redirect('/admin/signin') //後台使用者，丟到後台登入
    }
  } else {
    res.redirect('/signin') // 沒登入，把user丟回 signin 畫面
  }
}

const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() } // 是 admin 往下走
    else if (helpers.getUser(req).role === 'user') {
      res.redirect('/signin') //一般使用者，丟到前台登入
    }
  } else {
    res.redirect('/admin/signin') // 是admin 丟到 admin signin 畫面
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
