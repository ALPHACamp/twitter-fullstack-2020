const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const upload = require('../middleware/multer')

const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logOut)

router.get('/tweets', authenticated, tweetController.getTweets)

router.get('/users/setting', authenticated, userController.settingPage)
router.get('/users/:id/followers', authenticated, userController.getFollowship, userController.getFollower) // 跟隨中清單頁面
router.get('/users/:id/followings', authenticated, userController.getFollowship, userController.getFollowing) // 跟隨者清單頁面

router.get('/users/:id/tweets', authenticated, userController.getFollowship, userController.getUser) // 個人頁面
router.put('/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), authenticated, userController.putUser)// 上傳照片

router.get('/', (req, res) => res.redirect('/tweets')) // 專案初始測試路由

router.use('/', generalErrorHandler)

module.exports = router
