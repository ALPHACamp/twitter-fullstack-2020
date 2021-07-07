const helpers = require('../_helpers')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const userController = require('../controllers/userController')
const followController = require('../controllers/followController')

const { authenticate } = require('passport')

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).is_admin) { return next() }
      res.redirect('/signin')
    }
  }

  app.get('/', (req, res) => res.redirect('/users/followership'))

  app.get('/users/followership', authenticated, followController.getfollower)

  //follow function
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)


  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

}
