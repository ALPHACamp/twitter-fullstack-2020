const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

// 主畫面
router.get('/', (req, res) => res.redirect('/signin'))
router.get('/home', tweetController.getHomePage)
router.post('/tweet', tweetController.postTweet)
// 前台登入頁面
router.get('/signin', userController.userSigninPage)
// 前台註冊頁面
router.get('/register')
// 帳號設定頁面
router.get('/setting')
// 使用者登入
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', successRedirect: '/home' }))

// 後台登入頁面
router.get('/admin', (req, res) => res.redirect('/admin/signin'))
router.get('/admin/signin', adminController.adminSigninPage)
// 後台推文清單
router.get('/admin/tweets', adminController.adminTweetsPage)
// 後台使用者列表
router.get('/admin/users', adminController.adminUsersPage)
// 後台登入
router.post('/admin/signin', adminController.adminSignIn)
// 後台登出
router.post('/admin/signout', adminController.adminSignOut)

// USER
// 單一使用者
router.get('/users/:id', userController.getUser)

module.exports = router
