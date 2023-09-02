const express = require('express')
const router = express.Router()


// Controllers
const adminController = require('../../../middleware')

// middleware
const { adminAuthenticated } = require('../../../middleware/auth')

// Sign in
router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('adminSignin', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

// admin tweets
router.get('/tweets', adminAuthenticated, adminController.getTweets)
router.delete('/tweets/:id', adminAuthenticated, adminController.deleteTweet)

// admin users
router.get('/users', adminAuthenticated, adminController.getUsers)

module.exports = router
