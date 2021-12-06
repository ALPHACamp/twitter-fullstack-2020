const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])
const helpers = require('../_helpers')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, (req, res) => res.render('tweets', { user: helpers.getUser(req) }))

  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
  app.put('/api/users/:userId', cpUpload, userController.putUser)

  app.get('/signup', userController.signUpPage )
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}