const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated, authenticatedTweet } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const api = require('./modules/api')
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')
const replyController = require('../controllers/reply-controller')
const loginController = require('../controllers/login-controller')

router.use('/api', api)
router.use('/admin', admin)

router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)
router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logout)

router.get('/users/:userId/tweets', authenticated, userController.getUserTweetsPage)
router.get('/users/:userId/likes', authenticated, userController.getUserLikesPage)
router.get('/users/:userId/replies', authenticated, userController.getUserRepliesPage)
router.get('/users/:userId/followings', authenticated, userController.getUserFollowingsPage)
router.get('/users/:userId/followers', authenticated, userController.getUserFollowersPage)

router.get('/tweets/:tweetId/replies', authenticated, replyController.getTweetReplies)
router.post('/tweets/:tweetId/replies', authenticated, replyController.postReply)
router.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
router.post('/tweets/:tweetId/unlike', authenticated, tweetController.removeLike)
router.get('/tweets', authenticatedTweet, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweets)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)
router.use((req, res) => { res.status(404).render('404') })

module.exports = router
