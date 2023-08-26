const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

// Controllers
const adminController = require('../../controllers/admin-controller')

// middleware
const { adminAuthenticated } = require('../../middleware/auth')

// Sign in
router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('adminSignin', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

// admin tweets
router.get('/tweets', adminAuthenticated, adminController.adminGetTweets)

module.exports = router
