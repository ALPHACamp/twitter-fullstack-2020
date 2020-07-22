const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

const adminAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') { return next() }
    res.redirect('/')
  }
}

module.exports = (app, passport) => {
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin',
    passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
    userController.signIn)

  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin',
    passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }),
    adminController.signIn)
  app.get('/admin/tweets', adminAuthenticated, adminController.getTweets)
  app.get('/admin/users', adminAuthenticated, adminController.getUsers)

  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, (req, res) => res.render('tweets'))
}
