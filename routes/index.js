const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const adminController = require('../controllers/admin-controller')
const passport = require('../config/Passport');

router.get('/admin/signin', adminController.getSigninPage);
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin' }), adminController.signin);
router.get('/admin/users', adminController.getUsers)
router.delete('/admin/tweets/:tweetId', adminController.deleteTweet)
router.get('/admin/tweets', adminController.getTweets);

router.get('/signin', userController.login_page)
router.get('/tweets/id/replies', replyController.getReplies) //測試畫面用
router.get('/tweets', tweetController.getTweets)
router.get('/users/1/tweets', userController.getUser)

module.exports = router