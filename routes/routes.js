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
// 判斷是否以登入且為管理者
const adminAuthenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    if (helper.getUser(req).role === 'admin') return next()
    req.flash('error_messages', '禁止訪問！請向管理者申請管理者權限！')
    return res.redirect('/admin/signin')
  }
  req.flash('error_messages', '請先進行登入！')
  return res.redirect('/signin')
}

// 主畫面
router.get('/', (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, tweetController.getHomePage)
router.post('/tweet', tweetController.postTweet)
router.get('/tweets/:tweetId', tweetController.getReplyPage)
router.post('/tweets/:tweetId/reply', tweetController.replyTweet)
router.delete('/tweets/:tweetId', tweetController.deleteTweet)
router.post('/following/:userId', userController.addFollowing)
router.delete('/following/:userId', userController.removeFollowing)
// 前台登入頁面
router.get('/signin', userController.userSigninPage)
// 前台註冊頁面
router.get('/signup', userController.userSignupPage)
// 登出
router.get('/signout', userController.signout)
// 帳號設定頁面
router.get('/setting', authenticated, userController.accountSettingPage)
// 使用者登入
router.post(
  '/signin',
  userController.userCheckRequired,
  passport.authenticate('local', { failureRedirect: '/signin' }),
  userController.userSigninSuccess
)
// 使用者註冊
router.post('/signup', userController.userSignup)
// 儲存新帳號設定
router.post('/setting', authenticated, userController.accountSetting)

// ADMIN
// 後台登入頁面
router.get('/admin', (req, res) => res.redirect('/admin/signin'))
router.get('/admin/signin', adminController.adminSigninPage)
// 後台推文清單
router.get('/admin/tweets', adminAuthenticated, adminController.adminTweetsPage)
// 後台使用者列表
router.get('/admin/users', adminAuthenticated, adminController.adminUsersPage)
// 後台登入
router.post(
  '/admin/signin',
  adminController.adminCheckRequired,
  passport.authenticate('local', { failureRedirect: '/admin/signin' }),
  adminAuthenticated,
  adminController.adminSigninSuccess)
// 後臺刪除tweets
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
