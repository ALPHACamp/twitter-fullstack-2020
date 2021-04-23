const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const { authenticated } = require('../middleware/auth')

module.exports = (app, passport) => {
  //admin
  app.get('/admin/tweets', adminController.getTweets)
  app.delete('/admin/tweets/:id', adminController.deleteTweets)

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  //tweet
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.get('/tweets/:id', tweetController.getTweet)
  app.get('/tweets/new', tweetController.getAddTweet)
  app.post('/tweets', tweetController.addTweet)
  //replies
  app.post('/tweets/:id/reply', tweetController.addReply)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
  app.get('/users/setting', authenticated, userController.settingPage)
  app.put('/users/setting', authenticated, userController.putSetting)
}




