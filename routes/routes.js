const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

// 主畫面
router.get('/', (req, res) => res.redirect('/home'))
router.get('/home', tweetController.getHomePage)
// router.get('/tweets/create', tweetController.createTweet)
// 後台登入頁面
router.get('/admin', (req, res) => res.redirect('/admin/signin'))
router.get('/admin/signin', adminController.adminSigninPage)
// 後台登入
router.post('/admin/signin', adminController.adminSignIn)
// 後台登出
router.post('/admin/signout', adminController.adminSignOut)
// 後台推文清單
router.get('/admin/tweets', adminController.adminTweetsPage)
// 後台使用者列表
router.get('/admin/users', adminController.adminUsersPage)

module.exports = router
