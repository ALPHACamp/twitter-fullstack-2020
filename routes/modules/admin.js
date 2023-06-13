const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { successRedirect: '/admin/tweets', failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

module.exports = router
