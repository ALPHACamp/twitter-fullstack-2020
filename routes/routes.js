const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helper = require('../_helpers')

const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

// 判斷是否已登入
const authenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    if (helper.getUser(req).role === 'user') return next()
    req.flash('error_messages', '管理者無法使用前台服務，只能登入後台！')
    return res.redirect('/admin/tweets')
  }
  req.flash('error_messages', '請先進行登入！')
  return res.redirect('/signin')
}
// 判斷是否已登入且為管理者
const adminAuthenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    if (helper.getUser(req).role === 'admin') return next()
    req.flash('error_messages', '禁止訪問！請向管理員申請管理者權限！')
    return res.redirect('/signin')
  }
  req.flash('error_messages', '請先進行登入！')
  return res.redirect('/admin/signin')
}

// Root path
// 首頁
router.get('/', (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, tweetController.getHomePage)
router.get('/tweets/:tweetId', authenticated, tweetController.getReplyPage)
// 發推
router.post('/tweet', authenticated, tweetController.postTweet)
router.delete('/tweets/:tweetId', authenticated, tweetController.deleteTweet)
// 回應推文
router.post('/tweets/:tweetId/reply', authenticated, tweetController.postReply)
router.delete('/tweets/:tweetId/:replyId', authenticated, tweetController.deleteReply)
// 回應留言
router.post('/tweets/:tweetId/:replyId/:replyTo', authenticated, tweetController.postSecondReply)
// 追隨
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
// LIKE
router.get('/like/:tweetId/:replyId/:secondReplyId', authenticated, tweetController.addLike)
router.get('/unlike/:tweetId/:replyId/:secondReplyId', authenticated, tweetController.removeLike)
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
router.post('/admin/signin', adminController.adminCheckRequired, passport.authenticate('local', { failureRedirect: '/admin/signin' }), adminController.adminSigninSuccess)
// 管理者刪除推文
router.delete('/admin/tweets/:tweetId', adminAuthenticated, adminController.adminDeleteTweets)

// USER
// 取得個人頁面
router.get('/users/:id', authenticated, userController.getUser)
// 取得個人like內容頁面
router.get('/users/:id/like', authenticated, userController.getUserLikeContent)
// 編輯個人資料業面
router.get('/users/:id/edit', authenticated, userController.editUser)
// 編輯個人資料
router.put('/users/:id/edit', authenticated, userController.putUser)
// 查看跟隨者名單
router.get('/users/:id/followers', authenticated, userController.getUserFollowerList)
// 查看追隨者名單
router.get('/users/:id/followings', authenticated, userController.getUserFollowingList)

module.exports = router
