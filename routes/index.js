const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.singUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logOut)

router.get('/tweets', authenticated, tweetController.getTweets)

router.get('/users/setting', authenticated, userController.settingPage)

router.get('/', (req, res) => res.redirect('/tweets')) // 專案初始測試路由

router.use('/', generalErrorHandler)

module.exports = router
