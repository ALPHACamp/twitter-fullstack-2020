/* Use Express Router */
const express = require('express');

const router = express.Router();

const users = require('./modules/users');
const tweets = require('./modules/tweets');
const likes = require('./modules/likes');
const followships = require('./modules/followships');

// For Authentication and Admin Login
const passport = require('../config/passport');
const authenticationHelper = require('../middleware/authenticationHelper');
const adminController = require('../controllers/adminController');

// Admin Portal
router.get('/admin', adminController.adminLoginPage);
router.post(
  '/admin',
  passport.authenticate('local', { failureRedirect: '/admin' }),
  (req, res, next) => {
    if (req.user.toJSON().role === 'admin') {
      res.redirect('/admin_main');
    }
    req.flash('error_messages', 'No access allowed.');
    return res.redirect('/login');
  },
);
router.get('/admin_main', authenticationHelper.authenticatedAdmin, adminController.adminMain);
router.get('/admin_users', authenticationHelper.authenticatedAdmin, adminController.adminUsers);
router.delete('/admin_tweetDelete/:id', authenticationHelper.authenticatedAdmin, adminController.deleteTweet);

// User authentication
router.use('/', users);

// Main functions
router.use('/following/', authenticationHelper.authenticatedNonAdmin, followships);
router.use('/likes/', authenticationHelper.authenticatedNonAdmin, likes);
router.use('/tweets/', authenticationHelper.authenticatedNonAdmin, tweets);

// 匯出路由器
module.exports = router;
