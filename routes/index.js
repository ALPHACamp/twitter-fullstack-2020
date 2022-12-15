const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const followshipController = require('../controllers/followship-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', userController.signIn)
router.get('/logout', userController.logout)
router.get('/settings', userController.getSetting)
router.put('/settings', userController.putSetting)

router.get('/users/:id/tweets', userController.getUserTweets)
router.get('/users/:id/replies', userController.getUserReplies)
router.get('/users/:id/followings', userController.getUserFollowings)
router.get('/users/:id/followers', userController.getUserFollowers)
router.get('/users/:id/likes', userController.getUserLikes)
router.put('/users/:id/setup_profile', userController.putProfile)

router.post('/tweets/:id/like', tweetController.postLike)
router.post('/tweets/:id/unlike', tweetController.postUnlike)
router.post('/tweets/:id/replies', tweetController.postReply)
router.get('/tweets/:id', tweetController.getTweet)
router.get('/tweets', tweetController.getIndex)
router.post('/tweets', tweetController.postTweet)

router.delete('/followships/:id', followshipController.deleteFollowships)
router.post('/followships', followshipController.postFollowships)

router.get('/', (req, res) => res.redirect('/signin'))
router.use('/', generalErrorHandler)

module.exports = router
