const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const upload = require('../middleware/multer')

const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const apiController = require('../controllers/api-controller')
const replyController = require('../controllers/reply-controller')
const likesController = require('../controllers/likes-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logOut)

router.post('/tweets/:id/replies', authenticated, replyController.createReply)
router.get('/tweets/:id/replies', tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets) // 顯示全部推文
router.post('/tweets', tweetController.createTweet) // 新增推文

router.get('/reply/:id', authenticated, replyController.getReplies)
router.get('/users/:id/likes', authenticated, likesController.getLikes)
router.get('/users/setting', authenticated, userController.settingPage)

router.get('/users/:id/followers', authenticated, userController.getFollowship, userController.getFollower) // 跟隨中清單頁面
router.get('/users/:id/followings', authenticated, userController.getFollowship, userController.getFollowing) // 跟隨者清單頁面

router.get('/users/:id/tweets', authenticated, userController.getFollowship, userController.getUser) // 個人頁面
router.put('/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), authenticated, userController.putUser)// 上傳照片

router.post('/followships', authenticated, userController.addFollowing) // 追蹤功能
router.delete('/followships/:userId', authenticated, userController.removeFollowing) // 取消追蹤

router.get('/api/users/:id', authenticated, apiController.getUser)
router.post('/api/users/:id', authenticated, apiController.postUser)

router.post('/tweets/:TweetId/like', authenticated, userController.addLike) // 喜歡
router.post('/tweets/:TweetId/unlike', authenticated, userController.removeLike) // 不喜歡

router.get('/', (req, res) => res.redirect('/tweets')) // 專案初始測試路由
router.use('/', generalErrorHandler)

module.exports = router
