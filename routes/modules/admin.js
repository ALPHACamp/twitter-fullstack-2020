const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const passport = require('../../config/passport')
const { adminAuthenticated } = require('../../middleware/auth')

router.get('/signin', adminController.getSignin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.adminSignin)

router.get('/tweets', adminAuthenticated, adminController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweets)

router.get('/users', adminController.getUsers)

module.exports = router
