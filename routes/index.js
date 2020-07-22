const tweetController = require('../controllers/tweetController')
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
  app.get('/tweets', authenticated, tweetController.getTweets)

  app.post('/tweets', authenticated, tweetController.postTweet)
  app.get('/tweets/:id', authenticated, tweetController.getTweet)
  app.delete('/tweets/:id', adminAuthenticated, adminController.deleteTweet)

  app.get('/api/users/:id', authenticated, (req, res) => res.render('setting'))
}
