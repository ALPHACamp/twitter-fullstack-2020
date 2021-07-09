const twitController = require('../controllers/twitController.js')
const adminController = require('../controllers/adminController.js')

module.exports = app => {

  //首頁路由 ???
  app.get('/', (req, res) => res.redirect('/twitters'))
  app.get('/twitters', twitController.getTwitters)

  //admin ???
  app.get('/admin', (req, res) => res.redirect('/admin/twitters'))

  // == [ 後台相關路由 ]==

  // 後台登入頁面
  app.get('/admin/signin', adminController.adminSignin)
  // 後台登入頁面動作 ???
  app.post('/admin/signin', adminController.toAdminSignin)

  // 後台展示所有推特訊息 ???
  app.get('/admin/tweets', adminController.tweetsAdmin)

  // 後台展示特定推特訊息 ???
  app.get('/admin/twitters', adminController.getTwitter)

  // 後台修改特定推特訊息 ???
  // app.get('/admin/twitters/:id', adminController.putTwitter)

  // 後台刪除特定推特訊息 ???
  app.delete('/admin/twitters/:id', adminController.deleteTwitter)


  // 後台展示所有使用者
  app.get('/admin/users', adminController.adminUsers)

  // 後台刪除特定使用者
  app.delete('/admin/users/:id', adminController.deleteUser)



  // == [ 前台相關路由 ]==

  // 登入畫面
  app.get('/signin', twitController.signin)

  // 登入畫面動作
  app.post('/signin', twitController.toSignin)


  // 查看tweets的訊息回覆
  app.get('/tweets/replies', twitController.getReplies)

  // 提交tweets的訊息回覆
  app.post('/tweets/replies', twitController.toReplies)


  // 個人推文頁面
  app.get('/user/self', twitController.getUser)

  // 個人推文喜歡頁面
  app.get('/user/self/like', twitController.getUserLike)



  // 註冊畫面
  app.get('/signup', twitController.getSignup)

  // 註冊動作
  app.post('/signup', twitController.toSignup)


  // 查看跟隨者
  app.get('/user/self/follower', twitController.getFollower)

  // 查看正在跟隨
  app.get('/user/self/following', twitController.getFollowing)

  // 跟隨特定使用者
  app.post('/user/self/following/:id', twitController.toFollowing)

  // 取消跟隨特定使用者
  app.delete('/user/self/following/:id', twitController.deleteFollowing)

  // 前台帳戶設定
  app.get('/setting', twitController.getSetting)

  // 前台帳戶設定更改
  app.put('setting', twitController.putSetting)






}

