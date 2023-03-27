const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const admin = require('./modules/admin')
const replyController = require('../controllers/reply-controller')
const likesController = require('../controllers/likes-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage) // 註冊頁面
router.post('/signup', userController.signUp) // 註冊
router.get('/signin', userController.signInPage) // 登入頁面
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 登入
router.get('/logout', userController.logout) // 登出

router.post('/tweets/:id/replies', authenticated, replyController.createReply)//新增回覆
router.get('/tweets/:id', authenticated, userController.getFollowship, tweetController.getTweet) // 個人推文頁面
router.get('/tweets', authenticated, userController.getFollowship, tweetController.getTweets) // 總推文清單
router.post('/tweets', authenticated, tweetController.createTweet) // 新增推文
router.get('/reply/:id', authenticated, userController.getFollowship, replyController.getReplies) // 推文及回覆
router.get('/likes/:id', authenticated, userController.getFollowship, likesController.getLikes) // 喜歡的內容
router.get('/users/:id/followers', authenticated, userController.getFollower) // 跟隨中
router.get('/users/:id/followings', authenticated, userController.getFollowing) // 跟隨者

router.post('/tweets/:TweetId', authenticated, userController.addLike) // 喜歡
router.delete('/tweets/:TweetId', authenticated, userController.removeLike) // 不喜歡

router.get("/users/:id", authenticated, userController.getFollowship, userController.getUser) // 個人頁面
router.get('/setting', authenticated, userController.getSetting)  // 個人資料設定
router.put('/setting', authenticated, userController.putSetting)  // 個人資料編輯

router.post('/following/:userId', authenticated, userController.addFollowing) //追蹤功能
router.delete('/following/:userId', authenticated, userController.removeFollowing) //取消追蹤

router.get('/', (req, res) => res.redirect('/tweets'))// 設定feedback
router.use('/', generalErrorHandler)// 錯誤處裡

module.exports = router