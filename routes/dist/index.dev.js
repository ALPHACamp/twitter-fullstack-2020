"use strict";

var express = require('express');

var router = express.Router();

var admin = require('./modules/admin');

var passport = require('../config/passport');

var helpers = require('../_helpers');

var tweetController = require('../controllers/tweetController');

var replyController = require('../controllers/replyController');

var followshipController = require('../controllers/followshipController');

var userController = require('../controllers/user-controller');

var _require = require('../middleware/error-handler'),
    generalErrorHandler = _require.generalErrorHandler;

var _require2 = require('../middleware/auth'),
    authenticated = _require2.authenticated;

router.use('/admin', admin);
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply);
router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.postUnlike);
router.post('/tweets/:tweet_id/like', authenticated, tweetController.postLike);
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply);
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet);
router.get('/tweets', authenticated, tweetController.getTweets);
router.post('/tweets', authenticated, tweetController.postTweet);
router["delete"]('/followships/:followingId', authenticated, followshipController.removeFollowing);
router.post('/followships', authenticated, followshipController.addFollowing);
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);
router.get('/signin', userController.signInPage);
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn);
router.get('/logout', userController.logout);
router.get('/users/:id/tweets', authenticated, userController.tweets);
router.get('/users/:id/replies', authenticated, userController.replies);
router.get('/users/:id/likes', authenticated, userController.likes);
router.get('/users/:id/followers', authenticated, userController.followers);
router.get('/users/:id/followings', authenticated, userController.followings);
router.use('/', generalErrorHandler);
router.use('/', authenticated, tweetController.getTweets);
module.exports = router;