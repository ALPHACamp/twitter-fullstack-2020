const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controller/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')


router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/admin/logout', adminController.logout)

router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.get('/users', authenticatedAdmin, adminController.getUsers)

module.exports = router
