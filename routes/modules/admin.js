const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), authenticatedAdmin, adminController.signIn)
router.get('/logout', authenticatedAdmin, adminController.logout)
router.get('/tweets', authenticatedAdmin, adminController.getAdminTweets)
router.delete('/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)
router.get('/users', authenticatedAdmin, adminController.getAdminUsers)

module.exports = router
