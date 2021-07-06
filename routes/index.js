const helpers = require('../_helpers')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetcontroller')


module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {// = req.isAuthenticated()
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role) {
        return next()
      }
      return res.redirect('/')//似乎都會跑這裡
    }
    res.redirect('/signin')
  }

  //後台
  app.get('/admin/signin', adminController.adminSignInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.adminSignIn)
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)


  //登入、註冊、登出
  ////註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  ////登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  ////登出
  app.get('/logout', userController.logout)


  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)

}