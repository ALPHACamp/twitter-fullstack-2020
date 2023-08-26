const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')
const replyController = require('../controllers/reply-controller')
const loginController = require('../controllers/login-controller')

router.use('/admin', admin)

router.get('/tweets/:id/replies', authenticated, replyController.getTweetReplies)
router.post('/tweets/:tweetId/replies', authenticated, replyController.postReply)
router.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
router.post('/tweets/:tweetId/unlike', authenticated, tweetController.removeLike)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweets)

router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)
router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logout)
router.get('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
