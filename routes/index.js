const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const api = require('./modules/api')
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')
const replyController = require('../controllers/reply-controller')
const loginController = require('../controllers/login-controller')

router.use('/api', api)
router.use('/admin', admin)

router.get('/tweets', tweetController.getTweets) // test
router.get('/tweets/replies', tweetController.getTweetsReply) // test

router.get('/users/:userId/tweets', authenticated, userController.getUser)
router.get('/users/:userId/likes', authenticated, userController.getUserLikes)
router.get('/users/:userId/replies', authenticated, userController.getUserReplies)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)
router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticated, loginController.signIn)
router.get('/logout', loginController.logout)

router.get('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
