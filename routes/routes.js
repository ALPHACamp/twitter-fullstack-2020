const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tweetController = require('../controllers/tweetController');
const adminController = require('../controllers/adminController.js');
const helpers = require('../_helpers');
const passport = require('passport');
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next();
  }
  req.flash('error_messages', 'Please login first');
  res.redirect('/login');
};
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'Admin') {
      return next();
    }
    req.flash('error_messages', 'You are not an admin, please login here');
    return res.redirect('/login');
  }
  res.redirect('/login');
};

router.get('/', (req, res) => res.redirect('/tweets'));

router.get('/tweets', tweetController.getTweets);
router.get('/tweets/:id', authenticated,  tweetController.getTweet);

router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signup);
router.get('/login', userController.loginPage);
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  userController.login
);

router.get('/admin/login', adminController.adminLoginPage);
router.post('/admin/login', passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: true
  }),
  adminController.login
);
router.get('/admin', (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/tweets', adminController.getTweets)
router.get('/admin/tweetsUser', adminController.getUsers)
router.delete('/admin/tweets/:id', adminController.deleteTweet)

router.get('/users/:id', userController.getUserTweet)




module.exports = router;
