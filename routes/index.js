const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

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

// 推回文 功能
router.post('/tweets/:tweetId/replies', authenticated, tweetController.addReply)
router.post('/tweets', authenticated, tweetController.addTweet)

// 推回文頁面
router.get('/tweets/create', authenticated, tweetController.createFakePage) // 假頁面
router.get('/tweets/:tweetId/repliesFake', authenticated, tweetController.replyFakePage) // 假頁面
router.get('/tweets/:tweetId/replies', authenticated, tweetController.getTweet) // 單一推文回文列表
router.get('/tweets', authenticated, tweetController.getTweets) // 首頁

// follow 功能
router.post('/followships', authenticated, userController.addFollowing) // 測試檔路由
router.post('/followships/:id', authenticated, userController.addFollowing)
router.delete('/followships/:id', authenticated, userController.removeFollowing)

// user
// 帳戶設定
router.get('/users/:id/setting', authenticated, userController.editUserPage)
router.put('/users/:id/setting', authenticated, userController.editUser)

// 編輯 user 資料
router.get('/users/:id/edit', authenticated, userController.editUserFakePage)
router.post('/users/:id/edit', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.editUser)

// 查看 user 相關頁面
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
