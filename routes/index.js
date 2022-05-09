const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const passport = require('../config/passport')
const userController = require('../controller/userController')
const tweetController = require('../controller/tweetsController.js')
const exampleController = require('../controller/exampleController')
const adminController = require('../controller/adminController.js')

// Admin
router.get('/admin/signin', adminController.signinPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/logout', adminController.logout)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

// 使用者登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
// 使用者註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)

// 推文
router.get('/tweets', authenticated, tweetController.getTweets)

// user
router.get('/users/:id/tweets', userController.getUserTweets)
router.get('/users/:id/replies', userController.getReplies)
router.get('/users/:id/likes', userController.getLikes)
router.get('/users/:id', userController.getUser)

router.get('/', exampleController.indexPage)
router.use('/', generalErrorHandler)

module.exports = router
