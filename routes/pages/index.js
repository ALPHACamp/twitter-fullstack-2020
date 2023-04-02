const express = require('express')
const router = express.Router()
const userController = require('../../controllers/pages/user-controller')
const tweetController = require('../../controllers/pages/tweet-controller')
const adminController = require('../../controllers/pages/admin/admin-controller')
const { generalErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')
const { authenticatedRegular, authenticatedAdmin } = require('../../middleware/auth')
const admin = require('./modules/admin')

router.get('/admin/signin', adminController.adminSignInPage)
router.post('/admin/signin', passport.authenticate('admin-local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.adminSignIn)
router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('user-local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logout)






router.get('/users/:id/tweets', authenticatedRegular, userController.getUserTweets)
router.get('/users/:id/replies', authenticatedRegular, userController.getUserReplies)
router.get('/users/:id/likes', authenticatedRegular, userController.getUserLikes)
router.get('/users/:id/followers', authenticatedRegular, userController.getUserFollowers)
router.get('/users/:id/followings', authenticatedRegular, userController.getUserFollowings)

router.get('/tweets/:id/replies', authenticatedRegular, tweetController.getTweet)
router.get('/tweets/', authenticatedRegular, tweetController.getTweets)
router.get('/setting', authenticatedRegular, userController.settingPage)
router.post('/setting', authenticatedRegular, userController.setting)
router.use('/', generalErrorHandler)
router.use('/', (req, res) => res.redirect('/tweets'))





module.exports = router
