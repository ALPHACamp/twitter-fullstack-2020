const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')

module.exports = (app, passport) => {
  app.get('/', (req, res) => { return res.render('tweets') })
  app.get('/users/login', userController.loginPage)
  app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
  app.get('/users/register', userController.registerPage)
  app.post('/users/register', userController.register)

  app.get('/tweets', tweetController.getTweets)
}