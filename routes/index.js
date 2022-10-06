const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const passport = require('../config/passport')

const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)
router.get('/users', userController.getUser)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/logout', userController.logout)

router.get('/setting', userController.getSetting)
router.get('/other', userController.getOtherPage)
router.get('/modals/reply', userController.getReply)
router.get('/modals/self', tweetController.getModalsTabs)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
