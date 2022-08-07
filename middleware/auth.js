const helpers = require('../_helpers')

const authenticatedUser = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'user') return next() // 如果有登入、且為一般使用者，繼續
    res.redirect('/admin/tweets') // 如果已登入、但是是admin，丟回admin首頁（/admin/tweets）
  } else {
    res.redirect('/signin') // 如果沒登入，丟回登入頁
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') return next() // 如果有登入、且為admin，繼續
    res.redirect('/tweets') // 如果已登入、但是是user，丟回user首頁（/tweets）
  } else {
    res.redirect('/admin/signin') // 如果沒登入，丟回登入頁
  }
}

module.exports = {
  authenticatedUser,
  authenticatedAdmin
}
