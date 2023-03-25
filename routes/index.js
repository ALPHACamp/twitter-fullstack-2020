const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const admin = require('./modules/admin')
const replyController = require('../controllers/reply-controller')
const likesController = require('../controllers/likes-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage) // 註冊頁面
router.post('/signup', userController.signUp) // 註冊
router.get('/signin', userController.signInPage) // 登入頁面
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 登入
router.get('/logout', userController.logout) // 登出

router.post('/tweets/:id/replies', replyController.createReply)//新增回覆
router.get('/tweets/:id', tweetController.getTweet) // 個人頁面
router.get('/tweets', tweetController.getTweets) // 總推文清單
router.post('/tweets', tweetController.createTweet) // 新增推文
router.get('/reply/:id', replyController.getReplies) // 推文及回覆
router.get('/likes/:id', likesController.getLikes) // 喜歡的內容
router.get('/users/:id/followers', userController.getFollower) // 跟隨中
router.get('/users/:id/followings', userController.getFollowing) // 跟隨者

router.get("/users/:id", userController.getUser) // 個人頁面
router.get('/setting', userController.getSetting)  // 個人資料設定
router.put('/setting', userController.putSetting)  // 個人資料編輯

router.get('/', (req, res) => res.redirect('/tweets'))// 設定feedback
router.use('/', generalErrorHandler)// 錯誤處裡

module.exports = router