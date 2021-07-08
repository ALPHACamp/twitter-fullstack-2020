const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')


module.exports = (app, passport) => {
  const authenticatedUser = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (!helpers.getUser(req).is_admin) { return next() }
      req.flash('error_messages', '管理員請由後台登入')

const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    // if(req.isAuthenticated)
    if (helpers.ensureAuthenticated(req)) {
      return next()

    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {

    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).is_admin) { return next() }
      req.flash('error_messages', '沒有權限')
      return res.redirect('/admin/signin')

    if (req.isAuthenticated()) {
      if (req.user.is_admin) { return next() }
      return res.redirect('/')

    }
    res.redirect('/signin')
  }


  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/signup', authenticatedAdmin, adminController.signUpPage)
  app.post('/admin/signup', authenticatedAdmin, adminController.signUp)
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), adminController.signIn)
  app.get('/signout', adminController.signOut)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticatedUser, userController.signIn)
  app.get('/signout', userController.signOut)

  app.get('/tweets', authenticatedUser, userController.getTweets)
  app.get('/', (req, res) => res.redirect('/tweets'))

  // tweets
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.get('/tweets/:id', authenticated, tweetController.getTweet)

  // admin
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/tweets/create', authenticatedAdmin, adminController.createTweet)
  app.post('/admin/tweets', authenticatedAdmin, adminController.postTweet)
  app.get('/admin/tweets/:id', authenticatedAdmin, adminController.getTweet)
  app.put('/admin/tweets/:id', authenticatedAdmin, adminController.putTweet)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/tweets/:id/edit', authenticatedAdmin, adminController.editTweet)

  // signin & signup
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

}
