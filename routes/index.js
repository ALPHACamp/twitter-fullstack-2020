const twitterController = require('../controllers/tweetController.js')
const helpers = require('../_helpers')


const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const replyController = require('../controllers/replyController.js')

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && !helpers.getUser(req).isAdmin) {
    return next()
  }
  req.flash('error_messages', '帳號或密碼輸入錯誤')
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
  app.get('/', authenticated, (req, res) => res.redirect('/home'))
  app.get('/home', authenticated, tweetController.getTweets)
  app.get('/userProfile', authenticated, userController.getUserProfile)
  app.get('/setting', authenticated, userController.getsetting)
  app.put('/users/:id/setting', authenticated, userController.putUser)

  // 後台登入登出
  app.get('/admin', adminController.signInPage)
  app.post('/admin', passport.authenticate('local', {
    failureRedirect: '/admin',
    failureFlash: true
  }), adminController.signIn)
  app.get('/logout', adminController.logout)

  // 後台首頁
  app.get('/admin_main', authenticatedAdmin, tweetController.getTweets)

  // 追蹤
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)

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