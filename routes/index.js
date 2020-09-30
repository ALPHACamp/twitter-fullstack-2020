const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const helpers = require('../_helpers');

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/users/login')
}

module.exports = (app, passport) => {
  app.get('/', (req, res) => { return res.redirect('/tweets') })
  app.get('/users/login', userController.loginPage)
  app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
  app.get('/users/register', userController.registerPage)
  app.post('/users/register', userController.register)

  app.get('/tweets', tweetController.getTweets)
  app.get('/users/settings', authenticated, userController.settingsPage)
  app.get('/users/logout', userController.logout)
}