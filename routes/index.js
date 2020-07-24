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
    req.flash('errorMessage', '非管理員請從前台登入')
    res.redirect('/admin/signin')
  }
  res.redirect('/signin')
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

  app.get('/logout', userController.logout)

  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)

  app.post('/tweets', authenticated, tweetController.postTweet)
  app.get('/tweets/:id', authenticated, tweetController.getTweet)
  app.delete('/tweets/:id', adminAuthenticated, adminController.deleteTweet)

  app.get('/api/users/:id', authenticated, (req, res) => res.render('setting'))
  app.put('/api/users/:id', authenticated, userController.putUser)
  app.get('/api/admin/users/:id', adminAuthenticated, (req, res) => res.render('admin/setting'))

  app.get('/users/:id/tweets', authenticated, userController.getTweets)
  app.get('/users/:id/likes', authenticated, userController.getLikes)
  app.get('/users/:id/replies', authenticated, userController.getReplies)

}
