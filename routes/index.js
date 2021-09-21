const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const replyController = require('../controllers/replyController.js')

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && (!helpers.getUser(req).role !== "admin")) {
    return next()
  } else {
    req.flash('error_messages', '帳號或密碼輸入錯誤')
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && (helpers.getUser(req).role === "admin")) {
    return next()
  } else {
    req.flash('error_messages', '帳號或密碼輸入錯誤')
  }
  res.redirect('/admin/signin')
}


module.exports = (app, passport) => {
  // 前台
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)

  // Like - Tweet
  app.post('/like/:tweetId', authenticated, userController.addLike)
  app.delete('/like/:tweetId', authenticated, userController.removeLike)

  app.get('/users/:id/tweets', authenticated, userController.getUserTweets)
  app.get('/user/self/reply', authenticated, userController.getReplyTweets)
  app.get('/setting', authenticated, userController.getSetting)
  app.put('/users/:id/setting', authenticated, userController.putUser)

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

  app.post('/tweets', tweetController.postTweet)
  //取得特定貼文資料
  app.get('/tweets/:id', tweetController.getTweet)
  //Reply回覆
  app.post('/replies', authenticated, replyController.postReply)


  // 後台登入及登出
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }), adminController.signIn)
  app.get('/admin/logout', adminController.logout)

  //後台 - 首頁
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  // // 後台 - 使用者列表
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  // // 後台 - 推文清單
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
}