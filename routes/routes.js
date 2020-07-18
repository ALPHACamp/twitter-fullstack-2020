const express = require('express');
const routes = require('.');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

const helpers = require('../_helpers');

const passport = require('../config/passport');

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next();
  }
  req.flash('error_messages', 'Please login first');
  res.redirect('/login');
};

//router.get('/', (req, res) => res.send('test'));
router.get('/admin/login', adminController.adminLoginPage);
router.get('/login', userController.loginPage);
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  userController.login
);
router.get('/signup', userController.signupPage);
router.post('/signup', userController.signup);

router.get('/tweets', authenticated, (req, res) => {
  res.send('all the tweets');
});
router.get('/', authenticated, (req, res) => {
  res.redirect('/tweets');
});

module.exports = router;
