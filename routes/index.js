const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

// user related
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, userController.putUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userController.getFollowings)

// followship related
router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:id', authenticated, userController.deleteFollowing)

// tweet related
router.get('/tweets/:id/replies', authenticated, replyController.getReplies)
//router.get('/tweets/:id/replies', authenticated, tweetController.getTweet)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.post('/tweets/:id/like', authenticated, userController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, userController.unlikeTweet)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logOut)
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
