/* Use Express Router */
const express = require('express');

const router = express.Router();

const users = require('./modules/users');
const tweets = require('./modules/tweets');

// For Authentication and Admin Login
const passport = require('../config/passport');
const helpers = require('../_helpers');
const usersController = require('../controllers/usersController');
const adminController = require('../controllers/adminController');

// User Auth middleware
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next();
  }
  res.redirect('/signin');
};
// Admin Auth middleware
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') { return next(); }
    return res.redirect('/');
  }
  res.redirect('/admin');
};

router.use('/', tweets);
router.use('/', users);

// Admin Portal
router.get('/admin', adminController.adminLoginPage);
router.post(
  '/admin',
  passport.authenticate('local', { failureRedirect: '/admin' }),
  (req, res, next) => {
    if (req.user.toJSON().role === 'admin') {
      next();
    }
    req.flash('error_messages', 'No access allowed.');
    return res.redirect('/login');
  },
  adminController.adminLogin,
);
router.get('/admin_main', authenticatedAdmin, adminController.adminMain);
router.get('/admin_users', authenticatedAdmin, adminController.adminUsers);

// 匯出路由器
module.exports = router;
