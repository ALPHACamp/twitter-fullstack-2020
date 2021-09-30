
const helpers = require('../_helpers');
//for test only

module.exports = {
  getUser: (req, res, next) => helpers.getUser(req),

  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
    req.flash('error_messages', '請先登入');
    return res.redirect('/signin');
  },

  authenticatedNonAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (module.exports.getUser(req, res, next).role !== 'admin') {
        return next();
      }
      req.flash('error_messages', '請由後台登入');
      return res.redirect('/admin/tweets');
    }
    req.flash('error_messages', '登入失敗，請再試一次');
    return res.redirect('/signin');
  },
  
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (module.exports.getUser(req, res, next).role === 'admin') {
        return next();
      }
      req.flash('error_messages', '沒有權限');
      req.logout();
      return res.redirect('/signin');
    }
    req.flash('error_messages', '請先登入');
    return res.redirect('/admin/signin');
  },
}
