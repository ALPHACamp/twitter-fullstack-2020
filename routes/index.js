const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
        if (helpers.getUser(req).role === "admin") { return next() }
      return res.redirect('/admin/signin')
    }
    res.redirect('/admin/signin')
  }

  //TODO:測試用路由

//   app.get('/',  (req, res) => {
//     res.render('./admin/adminUsers')
//   })

  app.get('/', authenticated, (req, res) => {
    res.render('index')
  })

  // app.get('/admin/signin', (req, res) => {
  //   res.render('./admin/adminTweets')
  // })



  // //TODO: 功能完成後可解除對應的註解(若VIEW還沒完成先連到signup測試)
  // //使用者顯示主頁面
  // router.get('/current_user', userController.getCurrentUser)


  // //TopUsers(要改成api)
  // router.get('/users/top', userController.getTopUsers)
  // //使用者顯示特定使用者頁面
  // router.get('/users/:user_id', userController.getUser)
  // //使用者所有貼文
  // router.get('/users/:user_id/tweets', userController.getUserTweets)
  // //使用者所有喜歡貼文
  // router.get('/users/:user_id/likes', userController.getUserLikeTweets)
  // //使用者所有回覆
  // router.get('/users/:user_id/replied_tweets', userController.getUserReplies)
  // //使用者追蹤清單
  // router.get('/users/:user_id/followings', userController.getUserFollowings)
  // //使用者粉絲清單(被追蹤)
  // router.get('/users/:user_id/followers', userController.getUserFollowers)

  // //追蹤使用者
  // router.post('/followships/:user_id', userController.addFollowing)
  // //取消追蹤使用者
  // router.delete('/followships/:user_id', userController.removeFollowing)

  TODO:// 貼文相關
  //顯示所有貼文(要改api)
  app.get('/index', authenticated, tweetController.getTweets)
 
  // //使用者新增一則貼文
  app.get('/index/create', authenticated, tweetController.createTweets)
  app.post('/index/create', authenticated, tweetController.postTweets)

  // //顯示特定貼文 (之後要新增其所含的回文)
  app.get('/index/:id', tweetController.getTweet)

  // 回文相關
  // //回覆特定貼文
  // router.post('tweets/:id', tweetController.createReply)
  // //顯示特定貼文回覆
  // router.get('/tweets/:id/replies', tweetController.getTweetReplies)
  // 編輯貼文回覆
  // router.get('/replies/:id/edit', tweetController.getReplyPage)
  // router.put('/replies/:id', tweetController.putReply)
  // 刪除回覆
  // router.delete('/replies/:id', tweetController.removeReply)
  // //喜歡特定貼文
  // router.post('/tweets/:id/like', tweetController.addLike)
  // //取消喜歡特定貼文
  // router.delete('/tweets/:id/like', tweetController.removeLike)
  // 新增貼文
  // router.get('/tweets/create', tweetController.createTweetPage)
  // router.post('/tweets', tweetController.createTweet)
  // 編輯貼文
  // router.get('/tweets/:id/edit', tweetController.editTweet)
  // router.put('/tweets/:id', tweetController.putTweet)
  // 刪除貼文
  // router.delete('/tweets/:id', tweetController.removeTweet)


//   passport.authenticate('local', { 
//     failureRedirect: '/admin/signin', 
//     failureFlash: true 
//   }),


  // //管理者登入(後台登入)
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin',passport.authenticate('local', { 
    failureRedirect: '/admin/signin', 
    failureFlash: true 
  }), adminController.signin)
  // //後台登出
  app.get('/admin/logout', adminController.logout)
  //管理者顯示所有貼文
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  // //管理者刪除貼文
  app.delete('/admin/tweets/:id', adminController.deleteTweets)
  // //管理者顯示所有使用者
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)


  // //使用者登入頁面
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  // //使用者編輯帳號設定(setting)
  app.get('/users/:user_id/setting', authenticated, userController.editSettingPage)
  app.put('/users/:user_id/setting', authenticated, userController.putSetting)
  // //使用者編輯個人資料(edit)
  app.get('/users/:user_id/edit', authenticated, userController.editProfilePage)
  app.put('/users/:user_id/profile', authenticated, upload.single('avatar'), userController.putProfile)
  // //註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // //登出
  app.get('/logout', userController.logout)
}


// module.exports = router

