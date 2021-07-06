const helpers = require('../_helpers')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController')


module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {// = req.isAuthenticated()
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

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))

  //後台
  app.get('/admin/signin', adminController.adminSignInPage)
  app.post('/admin/tweets', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

  // 正在處理管理者後台首頁登入的路由問題



  //登入、註冊、登出
  ////註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  ////登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  ////登出
  app.get('/logout', userController.logout)
}