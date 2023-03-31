const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
    req.flash('wrong_messages', '帳號不存在')
    return res.redirect('/admin/tweets')
  }
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role !== 'admin') {
    return next()
  }
  res.redirect('/signin')
}// 一般使用者判斷
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role !== 'admin') {
    req.flash('wrong_messages', '帳號不存在')
    return res.redirect('/admin/signin')
  }
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).role === 'admin') {
    return next()
  }
  res.redirect('/admin/signin')
}// admin使用者判斷

module.exports = {
  authenticated,
  authenticatedAdmin
}