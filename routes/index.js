const twitterController = require('../controllers/tweetController.js')
const helpers = require('../_helpers')

const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).isAdmin) {
    return next()
  }
  req.flash('error_messages', '帳號或密碼輸入錯誤')
  res.redirect('/admin')
}


module.exports = (app, passport) => {
  // 前台首頁
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  
  // 使用者
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  // Like - Tweet
  app.post('/like/:tweetId', authenticated, userController.addLike)
  app.delete('/like/:tweetId', authenticated, userController.removeLike)

  // 追蹤
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)

  // 後台 - 首頁
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  // 後台 - 使用者列表
  app.get('/admin/users', authenticatedAdmin, adminController.adminGetUsers)
  // 後台 - 推文清單
  app.get('/admin/tweets', authenticatedAdmin, adminController.adminGetTweets)
  router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

  // 註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // 登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  // 登出
  app.get('/logout', userController.logout)

  //取得特定貼文資料
  app.get('/tweet/:id', tweetController.getTweet)
}