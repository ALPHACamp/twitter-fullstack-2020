const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/admin-controller')
const followshipController = require('../controllers/followship-controller')
const profileController = require('../controllers/profile-controller')
const userController = require('../controllers/user-controller')
const tweetsController = require('../controllers/tweets-controller')
const apiProfileController = require('../controllers/api-profile-controller')

const { authenticated, adminAuthenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

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

<<<<<<< HEAD
=======
// index
router.get('/tweets', authenticated, tweetsController.getTweets)
router.get('/tweets/:tweetId/replies', authenticated, tweetsController.getTweet)

// profile
>>>>>>> origin/master
router.get('/users/:userId/tweets', authenticated, profileController.getUser, profileController.getUserTweets)
router.get('/users/:userId/replies', authenticated, profileController.getUser, profileController.getUserReplies)
router.get('/users/:userId/likes', authenticated, profileController.getUser, profileController.getUserLikes)
router.get('/users/:userId/followings', authenticated, profileController.getUserFollowings)
router.get('/users/:userId/followers', authenticated, profileController.getUserFollowers)
<<<<<<< HEAD
router.get('/users/:userId', authenticated, profileController.editUser)
router.get('/tweets/:tweetId/replies', authenticated, tweetsController.getTweet)
router.post('/tweets/:tweetId/replies', authenticated, tweetsController.postReply)
router.post('/tweets/:tweetId/like', authenticated, userController.postLike)
router.post('/tweets/:tweetId/unlike', authenticated, userController.postUnlike)
router.get('/tweets', authenticated, tweetsController.getTweets)
router.post('/tweets', authenticated, tweetsController.postTweet)
=======
router.get('/users/:userId', authenticated, profileController.editUserAccount)

router.put(
  '/users/:userId',
  authenticated,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  profileController.putUserAccount
)

// api
router.get('/api/users/:userId', authenticated, apiProfileController.editUserAccount)

router.post(
  '/api/users/:userId',
  authenticated,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  apiProfileController.putUserAccount
)
>>>>>>> origin/master

router.use('/', (req, res) => res.redirect('/tweets'))

router.use('/', generalErrorHandler)

module.exports = router
