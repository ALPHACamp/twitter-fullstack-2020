const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')
const tweetController = require('../controllers/tweetController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  app.get('/', authenticated, (req, res) => res.redirect('/users'))
  app.get('/tweets', authenticated, tweetController.getTweets)

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/users'))
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/signout', userController.signOut)
<<<<<<< HEAD
}
=======

  app.get('/tweets', tweetController.getTweets)

} 
>>>>>>> 93b3d49a85013a532470942ad0f9bc3fdcb453ec
