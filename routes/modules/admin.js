const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const { authenticatedAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.SignInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.SignIn)
router.get('/logout', authenticatedAdmin, adminController.logout)

router.delete('/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticatedAdmin, adminController.GetTweets)

router.get('/users', authenticatedAdmin, adminController.getUsers)

router.use('/', (req, res) => res.redirect('/admin/signin'))

module.exports = router
