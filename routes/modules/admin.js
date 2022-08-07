const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/logout', adminController.logout)
router.get('/tweets', authenticatedAdmin, adminController.getAdminTweets)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/users', authenticatedAdmin, adminController.getAdminUsers)
router.use('/', (req, res) => res.redirect('/admin/tweets'))

module.exports = router
