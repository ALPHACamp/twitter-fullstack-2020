const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'normal') {
        return next()
      }
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      res.redirect('/admin/signin')
    }
  }

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  //設定前台流覽總推文路由
  
  app.get('/tweets', authenticated, tweetController.getTweets)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  // admin
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
  app.get('/admin/logout', adminController.logout)
}