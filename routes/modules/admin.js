const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signinPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin' }), adminController.signin)

router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)

router.get('/users', authenticatedAdmin, adminController.getUsers)

module.exports = router