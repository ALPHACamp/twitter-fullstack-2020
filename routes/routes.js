const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helper = require('../_helpers')

const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

// 判斷是否已登入
const authenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) return next()
  req.flash('error_messages', '請先進行登入！')
  return res.redirect('/signin')
}
// 判斷是否已登入且為管理者
const adminAuthenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    if (helper.getUser(req).role === 'admin') return next()
    req.flash('error_messages', '禁止訪問！請向管理者申請管理者權限！')
    return res.redirect('/admin/signin')
  }
  req.flash('error_messages', '請先進行登入！')
  return res.redirect('/signin')
}

// Root path
// 首頁
router.get('/', (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, tweetController.getHomePage)
router.get('/tweets/:tweetId', tweetController.getReplyPage)
router.post('/tweet', tweetController.postTweet)
router.post('/tweets/:tweetId/reply', tweetController.replyTweet)
router.delete('/tweets/:replyId', tweetController.deleteReply)
router.delete('/tweets/:tweetId', tweetController.deleteTweet)
router.post('/following/:userId', userController.addFollowing)
router.delete('/following/:userId', userController.removeFollowing)
// 取得登入頁面
router.get('/signin', userController.userSigninPage)
// 取得註冊頁面
router.get('/signup', userController.userSignupPage)
// 登出
router.get('/signout', userController.signout)
// 取得帳號設定頁面
router.get('/setting', authenticated, userController.accountSettingPage)
// 回傳登入資訊
router.post('/signin', userController.userCheckRequired, passport.authenticate('local', { failureRedirect: '/signin' }), userController.userSigninSuccess)
// 回傳註冊資訊
router.post('/signup', userController.userSignup)
// 回傳帳號設定資訊
router.post('/setting', authenticated, userController.accountSetting)

// ADMIN
// 轉址至管理者登入頁面
router.get('/admin', (req, res) => res.redirect('/admin/signin'))
// 取得管理者登入頁面
router.get('/admin/signin', adminController.adminSigninPage)
// 取得管理推文頁面
router.get('/admin/tweets', adminAuthenticated, adminController.adminTweetsPage)
// 取得管理使用者頁面
router.get('/admin/users', adminAuthenticated, adminController.adminUsersPage)
// 回傳管理者登入資訊
router.post('/admin/signin', adminController.adminCheckRequired, passport.authenticate('local', { failureRedirect: '/admin/signin' }),
  adminAuthenticated, adminController.adminSigninSuccess)
// 管理者刪除推文
router.delete('/admin/tweets/:tweetId', adminAuthenticated, adminController.adminDeleteTweets)

// USER
// 取得個人頁面
router.get('/users/:id', userController.getUser)
// 取得個人like內容頁面
router.get('/users/:id/like', userController.getUserLikeContent)
// 編輯個人資料業面
router.get('/users/:id/edit', userController.editUser)
// 編輯個人資料
router.put('/users/:id/edit', userController.putUser)
// 查看跟隨者名單
router.get('/users/:id/followers', userController.getUserFollowerList)
// 查看追隨者名單
router.get('/users/:id/followings', userController.getUserFollowingList)

module.exports = router
