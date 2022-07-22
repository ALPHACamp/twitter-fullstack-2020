const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const admin = require('./modules/admin')
const tweetController = require('../controller/tweet-controller')
const userController = require('../controller/user-controller')
const commentController = require('../controller/comment-controller')

const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/tweets/:tweetId/replies', authenticated, tweetController.getTweet)
router.post('/tweets/:tweetId/replies', authenticated, commentController.postComment)
router.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
router.post('/tweets/:tweetId/unlike', authenticated, tweetController.removeLike)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.get('/users/:userId/tweets', authenticated, userController.getTweets)
router.get('/users/:userId/replies', authenticated, userController.getReplies)
router.get('/users/:userId/likes', authenticated, userController.getLikes)
router.get('/users/:userId/followings', authenticated, userController.getFollowings)
router.get('/users/:userId/followers', authenticated, userController.getFollowers)
router.get('/users/:userId/settings', authenticated, userController.getSettings)
router.post('/users/:userId/settings', authenticated, userController.postSettings)

router.get('/api/users/:userId', authenticated, userController.getUser)
router.post('/api/users/:userId', authenticated, upload.fields([
  { name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.postProfile)

router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:userId', authenticated, userController.removeFollowing)

router.use('/', (req, res) => res.redirect('/tweets'))

router.use('/', generalErrorHandler)

module.exports = router
