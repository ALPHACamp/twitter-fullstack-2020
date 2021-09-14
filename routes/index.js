const twitterController = require('../controllers/tweetController.js')
const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
// const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}


module.exports = (app, passport) => {

  //如果使用者訪問首頁，就導向 /main 的頁面
  app.get('/', authenticated, (req, res) => res.redirect('/home'))

  //在 /main 底下則交給 restController.gettweets 來處理
  app.get('/home', authenticated, twitterController.getTweets)
  // 後台首頁
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
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