const twitController = require('../controllers/twitController.js')
const adminController = require('../controllers/adminController.js')
const passport = require('passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role) { return next() }
      return res.redirect('/user/self')
    }
    res.redirect('/signin')
  }


  //首頁路由 ???
  app.get('/', authenticated, twitController.getTwitters) //
  // app.get('/twitters', twitController.getTwitters)
  app.post('/', authenticated, twitController.toTwitters)

  //admin ???
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/twitters'))

  // == [ 後台相關路由 ]==

  // 後台登入頁面
  app.get('/admin/signin', adminController.adminSignin)
  // 後台登入頁面動作
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.toAdminSignin)

  // 後台展示所有推特訊息
  app.get('/admin/tweets', authenticatedAdmin, adminController.tweetsAdmin)

  // 後台展示特定推特訊息
  app.get('/admin/twitters:id', authenticatedAdmin, adminController.getTwitter)




  // 後台修改特定推特訊息
  // app.get('/admin/twitters/:id', adminController.putTwitter)

  // 後台刪除特定推特訊息
  app.delete('/admin/twitters/:id', authenticatedAdmin, adminController.deleteTwitter)

  // 後台展示所有使用者
  app.get('/admin/users', authenticatedAdmin, adminController.adminUsers)

  // 後台刪除特定使用者
  app.delete('/admin/users/:id', authenticatedAdmin, adminController.deleteUser)



  // == [ 前台相關路由 ]==

  // 登入畫面
  app.get('/signin', twitController.signin)

  // 登入畫面動作
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), twitController.toSignin)

  //前台展示推特信息
  app.get('/tweets', twitController.getTwitters)

  // 前台查詢特定推特信息
  app.get('/tweets/:id', twitController.getIdTwitters)

  //前台發送推特信息
  // app.post('/tweets', twitController.putTwitters)

  // 前台推文回覆

  app.post('/twitter/replies', twitController.twitterReplies)


  // 查看tweets的訊息回覆
  app.get('/tweets/replies', authenticated, twitController.getReplies)

  // 提交tweets的訊息回覆
  app.post('/tweets/replies', twitController.toReplies)

  //前台針對特定推文 like/unlike
  app.post('/tweets/:id/like', twitController.getReplies)
  app.post('/tweets/:id/unlike', twitController.getReplies)

  //routes for follow
  app.get('/user/self/following', authenticated, twitController.getFollowing)
  app.post('/user/self/following/:userId', authenticated, twitController.toFollowing)
  app.delete('/user/self/following/:userId', authenticated, twitController.deleteFollowing)

  // 個人推文頁面
  app.get('/user/self', authenticated, twitController.getUser)
  app.put('/user/self', authenticated, upload.single('avatar'), twitController.toUser)

  //  個人推文回覆頁面
  app.get('/user/self/replies', authenticated, twitController.getUserReplies)
  // 個人推文喜歡頁面
  app.get('/user/self/like', authenticated, twitController.getUserLike)


  //特定使用者的所有 tweets
  app.get('/user/:id/tweets', twitController.getUserLike)

  // 註冊畫面
  app.get('/signup', twitController.getSignup)

  // 註冊動作
  app.post('/signup', twitController.toSignup)


  // 查看跟隨者
  app.get('/user/self/follower', authenticated, twitController.getFollower)
  // 訪問特定留言頁面
  app.get('/tweets/:id/replies', twitController.getIdReplies)
  app.post('/tweets/:id/replies', twitController.getIdReplies)







  // 前台帳戶設定
  app.get('/setting', authenticated, twitController.getSetting)

  // 前台帳戶設定更改
  app.put('/setting', authenticated, twitController.putSetting)

  // 前台登出
  app.get('/logout', twitController.logout)


  // 前台喜歡
  app.post('/tweets/:userId/like/:tweetId', authenticated, twitController.postLike)


}

