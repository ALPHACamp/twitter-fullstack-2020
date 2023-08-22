const express = require('express')
const router = express.Router()

// Controllers
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

// middleware
const { generalErrorHandler } = require('../middleware/error-handler')

// Admin
const admin = require('./modules/admin')
router.use('/admin', admin)

// Sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// Tweets
router.get('/tweets', tweetController.getTweets)

router.use('/', (req, res) => res.redirect('/tweets'))

router.use('/', generalErrorHandler)

module.exports = router
