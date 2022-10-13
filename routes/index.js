const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const passport = require('../config/passport')

const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const followshipController = require('../controllers/followship-controller')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const { authenticatedLimit } = require('../middleware/auth')
const { getRecommendedUsers } = require('../middleware/recommendedUser')
const upload = require('../middleware/multer')

// 如果是 admin 就導到 /admin/... 的路徑
router.use('/admin', admin)

// api
router.get('/api/users/:id', authenticatedLimit, userController.getUser)
router.post('/api/users/:id', authenticatedLimit, upload.fields([
  { name: 'image', count: 1 },
  { name: 'coverImage', count: 1 }
]), userController.postUser)

router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.postUnlike)

router.delete('/followships/:id', authenticated, followshipController.removeFollowing)
router.post('/followships', authenticated, followshipController.addFollowing)

router.get('/tweets/:id/replies', authenticated, replyController.getReplies)
router.post('/tweets/:id/replies', authenticated, replyController.postReplies)
router.post('/tweets/:id/unlike', authenticated, tweetController.postUnlike)
router.post('/tweets/:id/like', authenticated, tweetController.postLike)

router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logout)

router.get('/users/:id/tweets', authenticated, getRecommendedUsers, userController.tweets)
router.get('/users/:id/replies', authenticated, getRecommendedUsers, userController.replies)
router.get('/users/:id/likes', authenticated, getRecommendedUsers, userController.likes)

router.get('/users/:id/setting', authenticated, userController.getSetting)
router.put('/users/:id/setting', authenticated, userController.putSetting)

router.get('/users/:id/followers', authenticated, getRecommendedUsers, userController.followers)
router.get('/users/:id/followings', authenticated, getRecommendedUsers, userController.followings)

router.use('/', generalErrorHandler)
router.use('/', authenticated, tweetController.getTweets)

module.exports = router
