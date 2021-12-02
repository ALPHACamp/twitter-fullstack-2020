const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, (req, res) => res.render('tweets'))

  app.get('/signup', userController.signUpPage )
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  // admin
  app.get('/admin/signin', adminController.signInPage)
}