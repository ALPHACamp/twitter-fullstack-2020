const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')

// Controllers
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

// middleware
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

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
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.use('/users', authenticated, users)

// Tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.post('/tweets/:id/like', authenticated, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

router.use('/', generalErrorHandler)

module.exports = router
