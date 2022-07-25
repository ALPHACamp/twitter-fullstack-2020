"use strict";

var express = require('express');

var router = express.Router();

var passport = require('../config/passport');

var helpers = require('../_helpers');

var tweetController = require('../controllers/tweetController');

var replyController = require('../controllers/replyController');

var userController = require('../controllers/user-controller');

var _require = require('../middleware/error-handler'),
    generalErrorHandler = _require.generalErrorHandler;

var _require2 = require('../middleware/auth'),
    authenticated = _require2.authenticated;

router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);
router.get('/signin', userController.signInPage);
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn);
router.get('/logout', userController.logout);
router.use('/', generalErrorHandler); //前台 tweet 路由
//讀取 所有 tweet

router.get('/tweets', authenticated, tweetController.getTweets); //讀取 單一 tweet

router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet); //新增 tweet

router.post('/tweets', authenticated, tweetController.PostTweet); //前台 reply 路由
//讀取 reply 頁面

router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply); //新增 tweet 的 reply

router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply); //前台 tweet 路由(like)
//新增 tweet 的 like

router.post('/tweets/:tweet_id/like', authenticated, tweetController.postLike); //刪除 tweet 的 like

router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.postUnlike); //前台 followship 路由
//新增 追隨

router.post('/followships', authenticated, followshipController.addFollowing); //刪除 追隨

router["delete"]('/followships/:followingId', authenticated, followshipController.removeFollowing);
module.exports = router;