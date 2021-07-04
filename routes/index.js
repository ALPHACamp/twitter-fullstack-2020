const helpers = require('../_helpers')
const userController = require('../controllers/userController.js')


module.exports = (app, passport) => {
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