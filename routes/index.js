const helpers = require('../_helpers')

// const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

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
  // app.get('/tweets', authenticated, tweetController.getTweets)

  // 後台登入
  app.get('/admin', adminController.signInPage)
  app.post('/admin', passport.authenticate('local', {
    failureRedirect: '/admin',
    failureFlash: true
  }), adminController.signIn)

  // 後台首頁
  // app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  // app.get('/admin/tweets', authenticatedAdmin, adminController.adminGetTweets)

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

}