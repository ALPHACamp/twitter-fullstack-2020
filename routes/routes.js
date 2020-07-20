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
router.get('/tweets/:tweetId', tweetController.getReplyPage)
router.post('/tweets/:tweetId/reply', tweetController.replyTweet)
router.post('/following/:userId', userController.addFollowing)
router.delete('/following/:userId', userController.removeFollowing)
// 前台登入頁面
router.get('/signin', userController.userSigninPage)
// 前台註冊頁面
router.get('/signup', userController.userSignupPage)
// 帳號設定頁面
router.get('/setting', userController.accountSettingPage)
// 使用者登入
router.post(
  '/signin',
  userController.userCheckRequired,
  passport.authenticate('local', { failureRedirect: '/signin' }),
  userController.userSigninSuccess
)
// 使用者註冊
router.post('/signup', userController.userSignup)

// ADMIN
// 後台登入頁面
router.get('/admin', (req, res) => res.redirect('/admin/signin'))
router.get('/admin/signin', adminController.adminSigninPage)
// 後台登入
router.post(
  '/admin/signin',
  adminController.adminCheckRequired,
  passport.authenticate('local', { failureRedirect: '/admin/signin' }),
  adminController.adminSigninSuccess
) // 之後要再加上檢查是否為管理者?
// 後台登出
router.post('/admin/signout', adminController.adminSignOut)
// 後台推文清單
router.get('/admin/tweets', adminController.adminTweetsPage)
// 後台使用者列表
router.get('/admin/users', adminController.adminUsersPage)

// USER
// 取得個人頁面
router.get('/users/:id', userController.getUser)
// 取得個人like內容頁面
router.get('/users/:id/like', userController.getUserLikeContent)
// 編輯個人資料業面
router.get('/users/:id/edit', userController.editUser)
// 編輯個人資料
router.put('/users/:id/edit', userController.putUser)

module.exports = router
