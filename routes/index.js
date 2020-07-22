const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
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
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin', failureFlash: true }),
    userController.signIn)

  app.get('/admin/signin', (req, res) => res.render('admin/signin'))
  app.get('/admin/tweets', (req, res) => res.render('admin/tweets'))
  app.get('/admin/users', adminController.getUsers)

  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.post('/tweets', authenticated, tweetController.postTweet)
  app.get('/tweets/:id', authenticated, tweetController.getTweet)
  app.get('/api/users/:id', (req, res) => res.render('setting'))
}
