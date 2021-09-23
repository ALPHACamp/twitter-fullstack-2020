<<<<<<< HEAD
let routes = require('./routes')
let apis = require('./apis')

module.exports = (app) => {
  app.use('/', routes)
  app.use('/api', apis)
=======
const helpers = require('../_helpers')
const auth = require('../config/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

module.exports = (app, passport) => {
  app.get('/', auth.authenticatedGeneral, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', auth.authenticatedGeneral, tweetController.getTweets)

  app.get('/admin/signin', adminController.signinPage)
  app.post(
    '/admin/signin',
    passport.authenticate('local', {
      failureRedirect: '/admin/signin',
      failureFlash: true
    }),
    adminController.signin
  )
  app.get('/admin/tweets', auth.authenticatedAdmin, adminController.getTweets)

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

  app.get(
    '/users/:id/tweets',
    auth.authenticatedGeneral,
    userController.getUserTweets
  )
  app.get('/api/users/:id', auth.authenticatedGeneral, userController.editUser)
  app.put('/api/users/:id', auth.authenticatedGeneral, userController.putUser)
  // app.put('/users/:id', authenticatedGeneral, userController.putUser)
  // app.get('/users/:id/tweets', authenticatedGeneral, userController.getTweets)
>>>>>>> steven
}
