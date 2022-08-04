const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

const userController = require('../controllers/user-controller')
const followshipController = require('../controllers/followship-controller')
const tweetController = require('../controllers/tweet-controller')
const apiController = require('../controllers/api-controller')

// 使用者 登入/註冊
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// Tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:id/replies', tweetController.getTweet)
router.post('/tweets/:id/replies', tweetController.postReply)
router.post('/tweets/:id/like', authenticated, tweetController.likePost)
router.post('/tweets/:id/unlike', authenticated, tweetController.unlikePost)

// 使用者帳戶設定
router.get('/users/:id/setting', authenticated, userController.getSetting)
router.put('/users/:id/setting', authenticated, userController.putSetting)
router.post('/users/:id/edit', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.editUser)

// 使用者相關資料
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/followers', authenticated, userController.followers)
router.get('/users/:id/followings', authenticated, userController.followings)

// api 路由
router.get('/api/users/:id', authenticated, apiController.editUser)
router.post('/api/users/:id', authenticated, apiController.putUser)

// 跟隨功能
router.post('/followships/:userId', authenticated, followshipController.addFollowing)
router.delete('/followships/:userId', authenticated, followshipController.removeFollowing)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
