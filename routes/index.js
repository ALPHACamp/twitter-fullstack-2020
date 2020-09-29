const userController = require('../controllers/userController')

module.exports = (app, passport) => {

  //user login
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)
  app.get('/main', (req, res) => res.render('mainpage'))

}