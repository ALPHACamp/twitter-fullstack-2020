const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const { authenticatedAdmin } = require('../middleware/auth')

// 載入controller
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')
const replyController = require('../controller/reply-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)


//signin, logout
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//users
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/following', userController.getUserFollowing)
router.get('/users/:id/follower', userController.getUserFollower)


//reply
router.get('/tweets/:id', authenticated, replyController.getReplies)

//tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)


//fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
