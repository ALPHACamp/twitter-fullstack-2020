const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweetController = require ('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const likesController = require('../controllers/likes-contriller')

const admin = require('./modules/admin')
router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)

router.get('/tweets', tweetController.getTweets)
// 個人頁面
router.get('/tweets/:id', tweetController.getTweet)
// 推文及回覆
router.get('/reply/:id', replyController.getReplies)
// 喜歡的內容
router.get('/likes/:id',likesController.getLikes)
// 跟隨中
router.get('/users/:id/followers',userController.getFollower)
// 跟隨者
router.get('/users/:id/followings', userController.getFollowing)

router.get("/users",userController.getUser) // 個人頁面測試用畫面 路由先不加:id

module.exports = router