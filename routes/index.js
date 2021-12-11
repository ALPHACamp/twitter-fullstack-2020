const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
module.exports = (app, passport) => {
  // authenticated 與 authenticatedAdmin
  // 未來可嘗試refactor
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      
      if (helpers.getUser(req).role === 'admin') {
        req.flash('error_messages', '無法進入此頁面')
        return res.redirect('/admin/tweets')
      }
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      if (helpers.getUser(req).role === 'normal') {
        req.flash('error_messages', '無此權限')
        return res.redirect('back')
      }
      res.redirect('/admin/signin')
    }
  }
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  //app.get('/tweets', authenticated, (req, res) => res.render('tweets', { user: helpers.getUser(req) }))
  // user 系列
  // 瀏覽首頁
  app.get('/tweets', authenticated, tweetController.getTweets)
  // 瀏覽特定推文的推文與回覆串
  app.get('/tweets/:id/replies', authenticated, tweetController.getTweet)
  // user 新增推文
  app.post('/tweets', authenticated, tweetController.postTweet)
  // user 新增留言(回覆)
  app.post('/tweets/:tweetId/replies', authenticated, replyController.postReply)
  // 瀏覽特定user的個人資料 - 推文頁面
  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
  // 瀏覽特定user的個人資料 - 回覆頁面
  app.get('/users/:userId/replies', authenticated, userController.getUserReplies)
  // 瀏覽特定user的個人資料 - 喜歡頁面
  app.get('/users/:userId/likes', authenticated, userController.getUserLikes)
  // 瀏覽編輯使用者頁面
  app.get('/api/users/:userId', userController.getUser)
  // 更新編輯使用者
  app.post('/api/users/:userId', cpUpload, userController.postUser)
  // user followings頁面
  app.get('/users/:userId/followings', authenticated, userController.getUserFollowing)
  //user followers頁面
  app.get('/users/:userId/followers', authenticated, userController.getUserFollower)
  // user對貼文按喜歡
  app.post('/tweets/:tweetId/like', authenticated, userController.addLike)
  // user對貼文收回喜歡
  app.post('/tweets/:tweetId/unlike', authenticated, userController.removeLike)
  // 跟隨user
  app.post('/followships', authenticated, userController.addFollowing)
  // 取消跟隨user
  app.delete('/followships/:followingId', authenticated, userController.removeFollowing)
  // 瀏覽user帳號設定頁面
  app.get('/users/:userId/setting/edit', authenticated, userController.editSetting)
  // 更新帳號設定
  app.put('/users/:userId/setting', authenticated, userController.putSetting)
  // login - normal user
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
  // login - admin user
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
  app.delete('/admin/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/logout', adminController.logout)
}