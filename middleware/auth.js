const { ensureAuthenticated, getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req) && getUser(req).role === 'admin') {
    req.flash('wrong_messages', 'admin無法登入前台，已跳轉到後台頁面。')
    return res.redirect('/admin/tweets')
  }
  if(ensureAuthenticated(req) && getUser(req).role !== 'admin') {
    return next()
  }
  res.redirect('/signin')
}// 一般使用者判斷
const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req) && getUser(req).role !== 'admin'){
    req.flash('wrong_messages', '無權限登入後台，已跳轉到 Alphitter 首頁。')
    return res.redirect('/tweets')
  }
  if (ensureAuthenticated(req) && getUser(req).role === 'admin') {
      return next()
    }
    res.redirect('/admin/signin')
}// admin使用者判斷

module.exports = {
  authenticated,
  authenticatedAdmin
}