const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const passport = require('../config/passport')
const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

//Admin
router.get('/admin/signin', adminController.signinPage)
router.post(
  '/admin/signin',
  passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }),
  adminController.signin
)
router.get('/admin/tweets', auth.authenticatedAdmin, adminController.getTweets)
router.delete(
  '/admin/tweets/:id',
  auth.authenticatedAdmin,
  adminController.deleteTweet
)
router.get('/admin/users', auth.authenticatedAdmin, adminController.getUsers)

//User
router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)
router.get('/signin', userController.signinPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signin
)

router.get(
  '/users/setting/:id',
  auth.authenticatedGeneral,
  userController.editAccount
)

router.put(
  '/users/setting/:id',
  auth.authenticatedGeneral,
  userController.putAccount
)

router.get(
  '/users/:id/tweets',
  auth.authenticatedGeneral,
  userController.getUserTweets
)
router.get(
  '/users/:id/replies',
  auth.authenticatedGeneral,
  userController.getUserReplies
)
router.get(
  '/users/:id/likes',
  auth.authenticatedGeneral,
  userController.getUserLikes
)
router.get(
  '/users/:id/followings',
  auth.authenticatedGeneral,
  userController.getUserFollowings
)
router.get(
  '/users/:id/followers',
  auth.authenticatedGeneral,
  userController.getUserFollowers
)

// Tweets
router.get('/', auth.authenticatedGeneral, (req, res) =>
  res.redirect('/tweets')
)
router.get('/tweets', auth.authenticatedGeneral, tweetController.getTweets)
router.get('/tweets/:id/', auth.authenticatedGeneral, tweetController.getTweet)
router.post('/tweets', auth.authenticatedGeneral, tweetController.postTweet)
router.get(
  '/tweets/:id/replies',
  auth.authenticatedGeneral,
  tweetController.getReplyPage
)
router.post(
  '/tweets/:id/replies',
  auth.authenticatedGeneral,
  tweetController.postReply
)

// FollowerShip
router.post('/followships', auth.authenticatedGeneral, userController.follow)
router.delete(
  '/followships/:id',
  auth.authenticatedGeneral,
  userController.unFollow
)
router.get(
  'followships/top',
  auth.authenticatedGeneral,
  userController.getPopularUser
)

// Like
router.post('/tweets/:id/like', auth.authenticatedGeneral, tweetController.like)
router.post(
  '/tweets/:id/unlike',
  auth.authenticatedGeneral,
  tweetController.unLike
)

//登出
router.get('/logout', userController.logout)

module.exports = router
