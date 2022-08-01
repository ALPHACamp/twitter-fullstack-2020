const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const followshipController = require('../controllers/followship-controller')
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
router.get('/tweets/:id/replies', tweetController.getTweet)
router.post('/tweets/:id/replies', tweetController.postReply)

router.get('/users/:id/setting', authenticated, userController.getSetting)
router.put('/users/:id/setting', authenticated, userController.putSetting)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)

router.post('/followships/:userId', authenticated, followshipController.addFollowing)
router.delete('/followships/:userId', authenticated, followshipController.removeFollowing)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
