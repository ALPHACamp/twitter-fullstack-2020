const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const passport = require('passport')
const adminController = require('../controllers/adminController')
const { authenticate } = require('passport')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // Index page
  //app.get('/newsFeed', authenticated, (req, res) => res.render('newsFeed'))
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.post('/tweets', authenticated, tweetController.postTweet)

  // admin backstage
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweet/:id', authenticatedAdmin, adminController.deleteTweet)

  // sign in / sign out / sign up
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signIn', failureFlash: true }), userController.signIn)
  app.get('/signout', authenticated, userController.signOut)

  app.get('/admin/signin', (req, res) => res.render('./admin/signin', {layout: 'blank'}))
  app.post('/admin/signin', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (user.role !== '1') {
        req.flash('error_messages', 'User please signs in with user sign in page.')
        return res.redirect('/admin/signin')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success_messages', 'Signed in.')
        return res.redirect('/admin/tweets')
      })
    })(req, res, next)
  })

  // setting
  app.get('/setting/:id', authenticated, userController.settingPage)
  app.post('/setting/:id', authenticated, userController.setting)
}
