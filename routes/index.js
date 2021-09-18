const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

module.exports = (app, passport) => {
  const authenticatedGeneral = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (!helpers.getUser(req).isAdmin) {
        return next()
      }
    }
    res.redirect('/admin/login')
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

  app.get('/', authenticatedGeneral, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticatedGeneral, tweetController.getTweets)
  app.get('/admin/login', adminController.loginPage)
  app.post(
    '/admin/login',
    passport.authenticate('local', {
      failureRedirect: '/admin/login',
      failureFlash: true
    }),
    adminController.login
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
