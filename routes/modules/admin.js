const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/adminController')

router.get('/signin', adminController.signInPage)
router.post('/signin',passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  adminController.signIn
)


// Admin
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:tweetId',authenticatedAdmin,adminController.deleteTweet)
router.get('/users', authenticatedAdmin, adminController.getUsers)


module.exports = router
