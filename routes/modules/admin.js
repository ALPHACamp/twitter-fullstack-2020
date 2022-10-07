const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)

router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), authenticatedAdmin, adminController.signIn)

router.get('/tweets', authenticatedAdmin, adminController.getTweets)

module.exports = router
