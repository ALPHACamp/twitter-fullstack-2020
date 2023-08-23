const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// Controllers
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

// middleware
const { generalErrorHandler } = require('../middleware/error-handler')

// Admin
const admin = require('./modules/admin')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

// Sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// Sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { successRedirect: '/tweets', failureRedirect: '/signin' }))

// Log out
router.get('/logout', userController.logout)

// Tweets
router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
// 上行尚須補authenticated

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

router.use('/', generalErrorHandler)

module.exports = router
