const helpers = require('../_helpers');

module.exports = {
  getUser      : (req, res, next) => helpers.getUser(req),
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
    req.flash('error_messages', 'Please login first！');
    return res.redirect('/signin');
  },
  authenticatedNonAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (module.exports.getUser(req, res, next).role !== 'admin') { return next(); }
      req.flash('error_messages', 'Please login via administrator portal！');
      return res.redirect('/admin');
    }
    req.flash('error_messages', 'Login Failed, please try again.');
    return res.redirect('/signin');
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (module.exports.getUser(req, res, next).role === 'admin') { return next(); }
    }
    req.flash('error_messages', 'Please login first！');
    return res.redirect('/admin');
  },
};
