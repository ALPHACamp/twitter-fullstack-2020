const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === "admin") {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  //TODO:測試用路由
  app.get('/', authenticated, (req, res) => {
    res.render('index')
  })

  app.get('/setting', authenticated, (req, res) => {
    res.render('accountSetting')
  })


  // //TODO: 功能完成後可解除對應的註解(若VIEW還沒完成先連到signup測試)
  // //使用者顯示主頁面
  // router.get('/current_user', userController.getCurrentUser)


  // //TopUsers(要改成api)
  // router.get('/users/top', userController.getTopUsers)
  // //使用者顯示特定使用者頁面
  // router.get('/users/:user_id', userController.getUser)
  // //使用者編輯個人頁面(要改成api)
  // router.put('/users/:user_id/profile', userController.putUser)
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
  // router.post('/following/:user_id', userController.addFollowing)
  // //取消追蹤使用者
  // router.delete('/following/:user_id', userController.removeFollowing)

  TODO:// 貼文相關
  //顯示所有貼文(要改api)
  app.get('/index', authenticated, tweetController.getTweets)
  // //顯示特定貼文 (之後要新增其所含的回文)
  // router.get('/tweets/:id', tweetController.getTweet)
  // //使用者新增一則貼文
  app.get('/index/create', authenticated, tweetController.createTweets)
  app.post('/index/create', authenticated, tweetController.postTweets)

  // 回文相關
  // //回覆特定貼文
  // router.post('tweets/:id/replies', tweetController.createTweetReplies)
  
  //Like & Unlike
  // //喜歡特定貼文
  // router.post('/tweets/:id/like', tweetController.addLike)
  // //取消喜歡特定貼文
  // router.delete('/tweets/:id/like', tweetController.removeLike)


  // //管理者登入(後台登入)
  // router.get('/admin/signin', adminController.signinPage)
  // router.post('/admin/signin', adminController.signin)
  // //管理者顯示所有貼文
  // router.get('/admin/tweets', adminController.getTweets)
  // //管理者刪除貼文
  // router.delete('/admin/tweets/:id', adminController.deleteTweets)
  // //管理者顯示所有使用者
  // router.get('/admin/tweets', adminController.getUsers)


  // //使用者登入頁面
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  // //使用者編輯帳號設定
  app.get('/setting/:user_id', authenticated, userController.accountSetting)
  // //使用者編輯個人資料
  app.get('/users/:user_id/edit', authenticated, userController.profileSetting)
  // app.put('/users/:user_id', authenticated, upload.single('image'), userController.editProfile)
  // //註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // //登出
  app.get('/logout', userController.logout)
}


// module.exports = router

