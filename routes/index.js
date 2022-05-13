const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const passport = require('../config/passport')
const userController = require('../controller/userController')
const tweetController = require('../controller/tweetsController.js')
const adminController = require('../controller/adminController.js')

// Admin
router.get('/admin/signin', adminController.signinPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweets)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

// 使用者登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
// 使用者註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)

// 推文 LIKE 功能
router.post('/tweets/:tweetId/like', authenticated, userController.addLike)
router.post('/tweets/:tweetId/unlike', authenticated, userController.removeLike)

// 推文
router.get('/tweets/create', authenticated, tweetController.createFakePage)
router.get('/tweets/:tweetId/replies', authenticated, tweetController.replyFakePage)
router.post('/tweets/:tweetId/replies', authenticated, tweetController.addReply)
router.get('/tweets/:tweetId', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.addTweet)

// follow 功能
router.post('/followships', authenticated, userController.addFollowing)
router.post('/followships/:id', authenticated, userController.addFollowing)
router.delete('/followships/:id', authenticated, userController.removeFollowing)

// user
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/tweets', authenticated, userController.getUser)
router.get('/users/:id/replies', authenticated, userController.getReplies)
router.get('/users/:id/likes', authenticated, userController.getLikes)
router.get('/users/:id', authenticated, userController.getUser)

// 防呆路由
router.get('/users', authenticated, (req, res) => res.redirect('/tweets'))

router.get('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
