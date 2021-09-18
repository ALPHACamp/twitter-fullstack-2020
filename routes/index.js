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
    res.redirect('/signin')
  }

  app.get('/', authenticatedGeneral, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticatedGeneral, tweetController.getTweets)

  app.get('/admin/signin', adminController.signinPage)
  app.post(
    '/admin/signin',
    passport.authenticate('local', {
      failureRedirect: '/admin/signin',
      failureFlash: true
    }),
    adminController.signin
  )
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

  app.get('/signup', userController.signupPage)
  app.post('/signup', userController.signup)
  app.get('/signin', userController.signinPage)
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signin
  )
  app.get('/logout', userController.logout)
}
