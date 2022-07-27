const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport')
const helpers = require('../_helpers')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const followshipController = require('../controllers/followshipController')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.postUnlike)
router.post('/tweets/:tweet_id/like', authenticated, tweetController.postLike)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)


router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.delete('/followships/:followingId', authenticated,
  followshipController.removeFollowing)
router.post('/followships', authenticated, followshipController.addFollowing)



router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/:id/followers', authenticated, userController.followers)
router.get('/users/:id/followings', authenticated, userController.followings)

router.use('/', generalErrorHandler)
router.use('/', authenticated, tweetController.getTweets)
//router.use('/', (req, res) => res.send('404 not found'))


module.exports = router
