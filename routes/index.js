const express = require('express')
const router = express.Router()
// 引入Controller
const passport = require('../config/passport')
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

// 使用Modules

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
// 引入Modules
const admin = require('./modules/admin')

// 後台登入路由
router.get('/admin/signin', userController.adminSignInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), userController.adminSignIn)
// 後台驗證
router.use('/admin', authenticatedAdmin, admin)

// 前台註冊路由
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 前台登入路由
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

// 使用者功能路由
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)
router.get('/users/:id/followings',authenticated, userController.getUserFollowings)
router.get('/users/:id/setting', authenticated, userController.getUserSetting)
// router.put('/api/users/:id', authenticated, userController.putUserSetting)

router.get('/tweets/:id/replies', authenticated, tweetController.getTweet)
router.post('/tweets/:id/replies', authenticated, tweetController.postReply)
router.post('/tweets/:id/like', authenticated, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)

// 首頁
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

// 其他路由都不符合時，最終會經過的
router.use('/', (req, res) => res.redirect('/tweets'))

// 錯誤處理
router.use('/', generalErrorHandler)
module.exports = router