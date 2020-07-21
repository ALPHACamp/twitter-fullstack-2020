const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

module.exports = (app, passport) => {
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin', failureFlash: true }),
    userController.signIn)

  app.get('/admin/signin', (req, res) => res.render('admin/signin'))
  app.get('/admin/tweets', adminController.getTweets)
  app.get('/admin/users', adminController.getUsers)

  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)

  app.get('/api/users/:id', (req, res) => res.render('setting'))
}
