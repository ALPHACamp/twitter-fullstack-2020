const twitController = require('../controllers/twitController.js')
const adminController = require('../controllers/adminController.js')

module.exports = app => {

  //首頁路由 ???
  app.get('/', (req, res) => res.redirect('/twitters'))
  app.get('/twitters', twitController.getTwitters)



  //admin ???
  app.get('/admin', (req, res) => res.redirect('/admin/twitters'))


  // ????
  app.get('/admin/twitters', adminController.getTwitters)

  // 後台登入頁面
  app.get('/admin/signin', adminController.adminSignin)

  // 後台使用者列表
  app.get('/admin/users', adminController.adminUsers)

  // 後台管理規文清單
  app.get('/admin/tweets', adminController.tweetsAdmin)



  // ???
  app.get('/tweets/replies', twitController.getReplies)

  // 個人推文頁面
  app.get('/user/self', twitController.getUser)

  // 個人推文喜歡頁面
  app.get('/user/self/like', twitController.getUserLike)

  // 登入畫面
  app.get('/signin', (req, res) => {
    res.render('signin')
  })

  // 註冊畫面
  app.get('/signup', (req, res) => {
    res.render('signup')
  })


  // 前台帳戶設定
  app.get('/setting', (req, res) => {
    res.render('setting')
  })


  // 跟隨者
  app.get('/user/self/follower', twitController.getFollower)

  // 正在跟隨
  app.get('/user/self/following', twitController.getFollowing)



}

