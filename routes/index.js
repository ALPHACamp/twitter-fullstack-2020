const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

module.exports = (app, passport) => {

  app.get('/admin/tweets', adminController.getTweets)

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.get('/tweets/:id', tweetController.getTweet)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
  app.get('/users/setting', authenticated, userController.settingPage)
  app.put('/users/setting', authenticated, userController.putSetting)
  app.post('/users/:id/follow', authenticated, userController.followUser)
  app.delete('/users/:id/follow', authenticated, userController.unfollowUser)
  app.get('/users/top', authenticated, userController.getTopUsers)
  app.get('/users/:id/followers', authenticated, userController.getFollowers)
}




