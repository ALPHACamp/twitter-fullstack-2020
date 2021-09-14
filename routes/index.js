const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

module.exports = (app, passport) => {
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', tweetController.getTweets)
  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', adminController.getTweets)
  app.get('/register', userController.registerPage)
  app.post('/register', userController.register)
  app.get('/login', userController.loginPage)
  app.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true
    }),
    userController.login
  )
  app.get('/logout', userController.logout)
}
