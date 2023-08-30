const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')

// Controllers
const tweetController = require('../../controllers/pages/tweet-controller')
const userController = require('../../controllers/pages/user-controller')
const replyController = require('../../controllers/pages/reply-controller')

// middleware
const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')

// Admin
router.use('/admin', admin)

// Sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// Sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('userSignin', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// Log out
router.get('/logout', userController.logout)

// admin route
router.use('/admin', admin)

// users route
router.use('/users', authenticated, users)

// Tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.post('/tweets/:id/like', authenticated, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)

// Reply
router.post('/replies', authenticated, replyController.postReply)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

router.use('/', generalErrorHandler)

module.exports = router
