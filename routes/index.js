const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// Controllers
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

// middleware
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// Admin
const admin = require('./modules/admin')

router.use('/admin', admin)

// Like
router.post('/like/:TweetId', authenticated, userController.addLike)
router.delete('/like/:TweetId', authenticated, userController.removeLike)

// Sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// Sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('userSignin', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// Log out
router.get('/logout', userController.logout)

// Tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

router.use('/', generalErrorHandler)

module.exports = router
