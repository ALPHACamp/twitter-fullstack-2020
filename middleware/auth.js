const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return res.redirect('/admin/tweets') // 是admin 丟到 admin tweets 畫面
    return next()
  }
  res.redirect('/signin') // 沒登入，把user丟回 signin 畫面
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next() // 是 admin 往下走
    res.redirect('/')
  } else {
    res.redirect('/admin/signin') // 是admin 丟到 admin signin 畫面
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
