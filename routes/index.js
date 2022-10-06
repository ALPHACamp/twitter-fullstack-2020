const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const passport = require('../config/passport')

const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

router.use('/admin', admin)
router.get('/users', userController.getUser)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/setting', userController.getSetting)
router.get('/other', userController.getOtherPage)
router.get('/modals/reply', userController.getReply)
router.get('/modals/self', tweetController.getModalsTabs)
router.get('/tweets/:id', tweetController.getTweet)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)

router.use('/', (req, res) => res.redirect('/twitters'))

module.exports = router
