const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const adminController = require('../controllers/admin-controller')
const passport = require('../config/Passport')
const helpers = require('../_helpers')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, adminAuthenticated } = require('../middleware/auth')


router.get('/admin/signin', adminController.getSigninPage);
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin);
router.get('/admin/users', adminAuthenticated, adminController.getUsers)
router.delete('/admin/tweets/:tweetId', adminAuthenticated, adminController.deleteTweet)
router.get('/admin/tweets', adminAuthenticated, adminController.getTweets);

router.get('/signin', userController.loginPage)
router.post('/signin', passport.authenticate('local', { successRedirect: '/tweets', failureRedirect: '/signin' }))
router.get('/signup', userController.registerPage)
router.post('/signup', userController.signup)
router.get('/api/users/:id', userController.settingPage)
router.get('/tweets/:id/replies', authenticated, tweetController.getReplies)
router.get('/tweets/:id', authenticated, tweetController.getReplies);
router.post('/tweets/id/replies', authenticated, tweetController.postReply)
router.post('/tweets/id/like', authenticated, tweetController.addLike)
router.post('/tweets/id/unlike', authenticated, tweetController.removeLike)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/users/1/tweets', userController.getUser)
router.get('/users/1/followers', userController.getFollowers)
router.get('/users/1/followings', userController.getFollowings)
router.get('/logout', userController.signout);
router.use('/', generalErrorHandler)
module.exports = router
