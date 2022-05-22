const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedAdmin, authenticated } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/logout', adminController.logout)

router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)

router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)

module.exports = router
