const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const passport = require('../../config/passport')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.getSignin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.adminSignin)

router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweets)

router.get('/logout', adminController.getLogout)

module.exports = router
