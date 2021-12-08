const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

module.exports = (app, passport) => {

  // authenticated 與 authenticatedAdmin 
  // 未來可嘗試refactor
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'normal') {
        return next()
      }
      if (helpers.getUser(req).role === 'admin') {
        req.flash('error_messages', '無法進入此頁面')
        return res.redirect('/admin/tweets')
      }

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
  app.get('/tweets', authenticated, (req, res) => res.render('tweets', { user: helpers.getUser(req) }))

  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
  
  //瀏覽編輯使用者頁面
  app.get('/api/users/:userId', userController.getUser)
  //更新使用者資訊
  app.post('/api/users/:userId', cpUpload, userController.postUser)

  //設定前台流覽總推文路由
  app.get('/tweets', authenticated, tweetController.getTweets)

  //設定前台瀏覽個別推文路由
  app.get('/tweets/:id/replies', authenticated, tweetController.getTweet)

  //設定使用者個人資料路由
  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)

  //設定使用者個人資料頁面推文與回覆路由
  app.get('/users/:userId/replies', authenticated, userController.getUserReplies)

  //瀏覽帳號設定頁面路由
  app.get('/users/:userId/setting/edit', authenticated, userController.editSetting)

  //更新帳號設定路由
  app.put('/users/:userId/setting', authenticated, userController.putSetting)

  // login
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  // admin
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
  app.delete('/admin/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/logout', adminController.logout)
}