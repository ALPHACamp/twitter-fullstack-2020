const passport = require('../config/passport')
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

module.exports = (app, passport) => {
  // const authenticated = (req, res, next) => {
  //   if (helpers.ensureAuthenticated(req)) {
  //     return next()
  //   }
  //   res.redirect('/signin')
  // }
  // const authenticatedAdmin = (req, res, next) => {
  //   if (helpers.ensureAuthenticated(req)) {
  //     if (helpers.getUser(req).is_admin) { return next() }
  //     res.redirect('/admin/signin')
  //   }
  // },

  // tweets
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', tweetController.getTweets)

  // admin
  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminController.getTweets)

  // signin & signup
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}
