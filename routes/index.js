const userController = require('../controllers/userController')
const passport = require('passport')

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

  // Index page
  app.get('/', authenticated, (req, res) => res.redirect('/newsFeed'))
  app.get('/newsFeed', authenticated, (req, res) => res.render('newsFeed'))

  // sign in / sign out / sign up
  app.get('/signUp', userController.signUpPage)
  app.post('/signUp', userController.signUp)
  app.get('/signIn', userController.signInPage)
  app.post('/signIn', passport.authenticate('local', { failureRedirect: '/signIn', failureFlash: true }), userController.signIn)
  app.get('/signOut', authenticated, userController.signOut)

  app.get('/admin/signIn', (req, res) => res.render('./admin/signIn'))
  app.post('/admin/signIn', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (user.role !== '1') {
        console.log(user)
        req.flash('error_messages', 'The account is not admin. Please sign in with users sign in page.')
        return res.redirect('/admin/signIn')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.redirect('/admin/twitters/')
      })
    })(req, res, next)
  })
}