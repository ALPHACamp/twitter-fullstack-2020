const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const replyController = require('../controllers/replyController.js')

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role !== "admin") {
      return next()
    }
    else {
      req.flash('error_messages', '帳號或密碼輸入錯誤')
    }
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === "admin") {
      return next()
    }
  } else {
    req.flash('error_messages', '帳號或密碼輸入錯誤')
  }
  res.redirect('/admin/signin')
}


// 前台
router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, tweetController.getTweets)

// Like - Tweet
router.post('/like/:tweetId', authenticated, userController.addLike)
router.delete('/like/:tweetId', authenticated, userController.removeLike)

router.get('/user/:id/replies', authenticated, userController.getUserSelfReply)
router.get('/user/:id/tweets', authenticated, userController.getUserTweets)
router.get('/setting', authenticated, userController.getSetting)
router.put('/users/:id/setting', authenticated, userController.putUser)

// 追蹤
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

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

router.post('/tweets', tweetController.postTweet)
//取得特定貼文資料
router.get('/tweets/:id', tweetController.getTweet)
//Reply回覆
router.post('/replies', authenticated, replyController.postReply)


// 後台登入及登出
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin',
  failureFlash: true
}), adminController.signIn)
router.get('/admin/logout', adminController.logout)

//後台 - 首頁
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

module.exports = router