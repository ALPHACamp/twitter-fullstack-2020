const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/admin-controller')
const followshipController = require('../controllers/followship-controller')
const profileController = require('../controllers/profile-controller')
const userController = require('../controllers/user-controller')
const tweetsController = require('../controllers/tweets-controller')

const { authenticated, adminAuthenticated } = require('../middleware/auth')

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

router.get('/users/:id/tweets', profileController.getUserTweets)
router.get('/users/:id/followings', profileController.getUserFollows)
router.get('/users/:id/followers', profileController.getUserFollows)
router.get('/users/:id', profileController.editUser)
router.get('/tweets/:tweetId/replies', authenticated, tweetsController.getTweet)
router.get('/tweets', authenticated, tweetsController.getTweets)
router.post('/tweets', authenticated, tweetsController.postTweet)

router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
