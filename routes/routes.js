const express = require('express')
const router = express.Router()
const passport = require('passport')

const auth = require('../config/auth')
const userController = require('../controllers/userController')

const tweetController = require('../controllers/tweetController')

const adminController = require('../controllers/adminController')


const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/', (req, res) => res.redirect('/signin'))

// 一般使用者登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

// User Tweets
router.post('/tweets/:id/like', auth.authenticatedUser, tweetController.like)
router.post('/tweets/:id/unlike', auth.authenticatedUser, tweetController.unLike)

// Admin
router.get('/admin/signin', userController.AdminSignInPage)
router.post('/admin/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin', failureFlash: true
}), userController.AdminSignIn)
router.get('/signout', userController.logout)

router.get('/tweets', auth.authenticatedUser, (req, res) => res.render('test'))
router.get('/admin/tweets', auth.authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:tweetId', auth.authenticatedAdmin, adminController.deleteTweet)

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/tweets', auth.authenticatedUser, (req, res) => res.render('tweets'))

// following
router.post('/followships', auth.authenticatedUser, userController.follow)
router.delete('/followships/:id', auth.authenticatedUser, userController.unfollow)

// user edit 相關路由
router.get('/api/users/:id', auth.authenticatedUser, userController.editUser)
router.put('/users/:id/edit', auth.authenticatedUser,
  upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUserInfo)
router.get('/users/:id/followers', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserFollowers) // 被追蹤
router.get('/users/:id/followings', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserFollowings) // 追蹤人

// setting 相關路由
router.get('/users/:id/setting', auth.authenticatedUser, userController.getSetting)
router.post('/api/users/:id', auth.authenticatedUser, userController.putSetting)

module.exports = router
