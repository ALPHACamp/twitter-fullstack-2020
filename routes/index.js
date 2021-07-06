const passport = require('../config/passport')
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')


module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (!helpers.getUser(req).is_admin)
        return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).is_admin) { return next() }
      res.redirect('/admin/signin')
    }
  }

  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminController.getTweets)
  app.get('/admin/signup', adminController.signUpPage)
  app.post('/admin/signup', adminController.signUp)
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', adminController.signIn)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', userController.signIn)

}
