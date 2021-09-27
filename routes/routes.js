const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const replyController = require('../controllers/replyController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const multipleUpload = upload.fields([{ name: 'avatar' }, { name: 'cover' }])


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!(helpers.getUser(req).role === "admin")) {
      return next()
    }
    else {
      req.flash('error_messages', '此帳號無前台權限，跳轉至後台')
      return res.redirect('/admin/tweets')
    }
  }
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === "admin") {
      return next()
    }
    else {
      req.flash('error_messages', '帳號或密碼輸入錯誤')
      return res.redirect('/signin')
    }
  }
  return res.redirect('/signin')
}

// 前台 登入後導向首頁
router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, tweetController.getTweets)

// 新增推文
router.post('/tweets', tweetController.postTweet)
// 取得特定貼文資料
router.get('/tweets/:id', tweetController.getTweet)

// 回覆
router.get('/tweets/:id/replies', authenticated, tweetController.getTweet)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)

// User's Profile
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replies', authenticated, userController.getUserSelfReply)
router.get('/users/:id/likes', authenticated, userController.getUserSelfLike)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userController.getFollowings)

// Like
router.post('/like/:tweetId', authenticated, userController.addLike)
router.delete('/like/:tweetId', authenticated, userController.removeLike)

// Follow
router.post('/followships/', authenticated, userController.addFollowing)
router.delete('/followships/:userId', authenticated, userController.removeFollowing)

// setting & edit
router.get('/users/:id/setting', authenticated, userController.getUserSetting)
router.put('/users/:id/setting', authenticated, userController.putUserSetting)
router.put('/users/:id/edit', authenticated, multipleUpload, userController.putUserProfile)

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
// 登出
router.get('/logout', userController.logout)

// 後台登入及登出
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin',
  failureFlash: true
}), adminController.signIn)
router.get('/admin/logout', adminController.logout)

//後台 - 首頁
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
// 後台 - 使用者列表
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
// 後台 - 推文清單
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

module.exports = router