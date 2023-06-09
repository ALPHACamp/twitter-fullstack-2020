const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/admin-controller')
const followshipController = require('../controllers/followship-controller')
const profileController = require('../controllers/profile-controller')
const userController = require('../controllers/user-controller')
const tweetsController = require('../controllers/tweets-controller')

const { authenticated, adminAuthenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// signin
router.get('/signin', userController.signinPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signin
)

// signup
router.get('/signup', userController.signupPage)

// admin
router.get('/admin/signin', adminController.adminSigninPage)
router.get('/admin/tweets', adminController.adminTweetsPage)
router.get('/admin/users', adminController.adminUsersPage)

router.get('/users/:userId/tweets', authenticated, profileController.getUser, profileController.getUserTweets)
router.get('/users/:userId/replies', authenticated, profileController.getUser, profileController.getUserReplies)
router.get('/users/:userId/likes', authenticated, profileController.getUser, profileController.getUserLikes)
router.get('/users/:userId/followings', authenticated, profileController.getUserFollowings)
router.get('/users/:userId/followers', authenticated, profileController.getUserFollowers)
router.get('/users/:userId', authenticated, profileController.editUser)
router.get('/tweets/:tweetId/replies', authenticated, tweetsController.getTweet)
router.post('/tweets/:tweetId/replies', authenticated, tweetsController.postReply)
router.get('/tweets', authenticated, tweetsController.getTweets)
router.post('/tweets', authenticated, tweetsController.postTweet)

router.use('/', (req, res) => res.redirect('/tweets'))

router.use('/', generalErrorHandler)

module.exports = router
