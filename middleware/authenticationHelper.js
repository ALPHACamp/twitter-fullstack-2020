const helpers = require('../_helpers');

module.exports = {
  getUser      : (req, res, next) => helpers.getUser(req),
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
    req.flash('error_messages', 'Please login first！');
    return res.redirect('/login');
  },
  authenticatedNonAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (module.exports.getUser(req, res, next).role !== 'admin') { return next(); }
    }
    req.flash('error_messages', 'Please login via administrator portal！');
    return res.redirect('/admin');
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (module.exports.getUser(req, res, next).role === 'admin') { return next(); }
    }
    req.flash('error_messages', 'Please login first！');
    return res.redirect('/admin');
  },
};
