const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const multipleUpload = upload.fields([{ name: 'avatar' }, { name: 'cover' }])

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === "normal") {
        return next()
      }
      if (helpers.getUser(req).role === "admin") {
        req.flash('error_messages', '管理者無法使用前台頁面')
        return res.redirect('/admin/tweets')
      }
    }
    req.flash('error_messages', '請先登入')
    res.redirect('/signin')
  }


  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === "admin") { return next() }
      req.flash('error_messages', '請確認使用者身分')
      return res.redirect('/admin/signin')
    }
    req.flash('error_messages', '請先登入')
    res.redirect('/admin/signin')
  }

  //TODO:測試用路由
  app.get('/', authenticated, (req, res) => {
    res.redirect('/tweets')
  })


  // //TODO: 功能完成後可解除對應的註解(若VIEW還沒完成先連到signup測試)
  // //使用者顯示主頁面
  // router.get('/current_user', userController.getCurrentUser)


  // //使用者顯示特定使用者頁面(使用者所有貼文)
  app.get('/users/:user_id/tweets', authenticated, userController.getUserTweets)
  // //使用者所有喜歡貼文
  app.get('/users/:user_id/likes', authenticated, userController.getUserLikes)
  // //使用者所有回覆
  app.get('/users/:user_id/replied', userController.getUserReplied)
  // //使用者追蹤清單
  // router.get('/users/:user_id/followings', userController.getUserFollowings)
  // //使用者粉絲清單(被追蹤)
  // router.get('/users/:user_id/followers', userController.getUserFollowers)

  // //追蹤使用者 (row 45)
  // router.post('/followships/:user_id', userController.addFollowing)
  // //取消追蹤使用者 (row 46)
  // router.delete('/followships/:user_id', userController.removeFollowing)

  TODO:// 貼文相關
  //顯示所有貼文(要改api)
  app.get('/tweets', authenticated, tweetController.getTweets)

  // //使用者新增一則貼文
  app.get('/tweets/create', authenticated, tweetController.createTweets)
  app.post('/tweets', authenticated, tweetController.postTweets)

  // //顯示特定貼文
  app.get('/tweets/:id', authenticated, tweetController.getTweet)

  // 回文相關
  // //顯示特定貼文回覆 (row40)
  app.get('/tweets/:id/replies', authenticated, tweetController.getTweetReplies)
  // //回覆特定貼文 (row 36)
  app.post('/tweets/:id', authenticated, tweetController.createReply)
  //------------擴充功能--------------//
  // 編輯貼文回覆 (row 37-38)
  // router.get('/replies/:id/edit', tweetController.getReplyPage)
  // router.put('/replies/:id', tweetController.putReply)
  // 刪除回覆 (row 39)
  // router.delete('/replies/:id', tweetController.removeReply)
  // 編輯貼文 (row 33-34)
  // router.get('/tweets/:id/edit', tweetController.editTweet)
  // router.put('/tweets/:id', tweetController.putTweet)
  // 刪除貼文 (row 35)
  // router.delete('/tweets/:id', tweetController.removeTweet)
  //------------------------------//

  // // Like & UnLike
  // //喜歡特定貼文
  app.post('/tweets/:id/like', authenticated, tweetController.addLike)
  // //取消喜歡特定貼文
  app.delete('/tweets/:id/like', tweetController.removeLike)

  // //管理者登入(後台登入)
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', passport.authenticate('local', {
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
  //-----------名稱勿再改動------------
  // //使用者編輯帳號設定(setting) (row 21-22)
  app.get('/users/:user_id/setting', authenticated, userController.getUserSetting)
  app.put('/users/:user_id/setting', authenticated, userController.putUserSetting)

  // //使用者編輯個人資料(edit) (row 22-23)
  app.put('/users/:user_id/edit', authenticated, upload.single('avatar'), userController.putUserEdit)
  //--------------------------------------
  // //註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // //登出
  app.get('/logout', userController.logout)
}


// module.exports = router


