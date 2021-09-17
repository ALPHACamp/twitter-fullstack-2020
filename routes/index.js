const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/login')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/login')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/tweets')
  )
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/register', userController.registerPage)
  app.post('/register', userController.register)
  app.get('/login', userController.loginPage)
  app.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true
    }),
    userController.login
  )
  app.get('/logout', userController.logout)
}
