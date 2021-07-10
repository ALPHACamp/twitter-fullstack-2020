const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const tweetController = require('../controllers/tweetController');

const authenticated = require('./authMiddleware').authenticated;
const authenticatedAdmin = require('./authMiddleware').authenticatedAdmin;

const helpers = require('../_helpers');
const passport = require('../config/passport');

router.get('/', authenticated, (req, res) => res.redirect('/tweets'));

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'));
router.get('/admin/users', authenticatedAdmin, adminController.getUsers);

router.get('/tweets', authenticated, tweetController.getTweets);
router.post('/tweets', authenticated, tweetController.postTweet);
router.get('/tweets/:id', authenticated, tweetController.getTweet);

router.post('/like/:tweetId', authenticated, userController.addLike);
router.delete('/like/:tweetId', authenticated, userController.removeLike);

router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);

router.get('/signin', userController.signInPage);
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn);

router.get('/admin/signin', adminController.signInPage);
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: 'admin/signin', failureFlash: true }), adminController.signIn);
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets);

router.delete('/admin/tweet/:id', authenticatedAdmin, adminController.deleteTweet);
router.get('/signout', userController.signOut);
router.get('/admin/signout', adminController.signOut);

router.get('/users/:id',authenticated, userController.userPage)

module.exports = router