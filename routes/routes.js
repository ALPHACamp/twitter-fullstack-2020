const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../config/auth')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const chatroomController = require('../controllers/chatroomController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// root
router.get('/', auth.authenticatedUser, (req, res) => res.redirect('/tweets'))

// 一般使用者登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

// User Tweets
router.get('/tweets', auth.authenticatedUser, userController.getRecommendedFollowings, tweetController.getTweets)
router.post('/tweets', auth.authenticatedUser, tweetController.postTweet)
router.post('/tweets/:id/like', auth.authenticatedUser, tweetController.like)
router.post('/tweets/:id/unlike', auth.authenticatedUser, tweetController.unLike)
router.get('/tweets/:id', userController.getRecommendedFollowings, auth.authenticatedUser, tweetController.getTweet)
router.post('/tweets/:id/replies', auth.authenticatedUser, tweetController.postReply)
router.get('/tweets/:id/replies', auth.authenticatedUser, tweetController.getReply)

// Admin
router.get('/admin/signin', adminController.AdminSignInPage)
router.post('/admin/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin', failureFlash: true
}), adminController.AdminSignIn)
router.get('/signout', userController.logout)
router.get('/admin/tweets', auth.authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:tweetId', auth.authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', auth.authenticatedAdmin, adminController.getUsers)

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// following
router.post('/followships', auth.authenticatedUser, userController.follow)
router.delete('/followships/:id', auth.authenticatedUser, userController.unfollow)

// user 相關路由
router.get('/api/users/:id', auth.authenticatedUser, userController.editUser)
router.put('/users/:id/edit', auth.authenticatedUser,
  upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUserInfo)
router.get('/users/:id/followers', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserFollowers) // 被追蹤
router.get('/users/:id/followings', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserFollowings) // 追蹤人
router.get('/users/:id/replies', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserReplies)
router.get('/users/:id/likes', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserLikes)
router.get('/users/:id/tweets', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserTweets)

// setting 相關路由
router.get('/users/:id/setting', auth.authenticatedUser, userController.getSetting)
router.post('/api/users/:id', auth.authenticatedUser, userController.putSetting)

// chatroom 相關路由
router.get('/chatroom/public', auth.authenticatedUser, chatroomController.getPublic)
router.get('/chatroom/:userId/:targetId', auth.authenticatedUser, chatroomController.getPrivate)

module.exports = router
