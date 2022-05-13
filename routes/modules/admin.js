const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/logout', adminController.logout)
router.get('/users', adminController.getUsers)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)

module.exports = router
