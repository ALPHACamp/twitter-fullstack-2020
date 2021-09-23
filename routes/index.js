const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

module.exports = (app, passport) => {
  const authenticatedGeneral = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (!helpers.getUser(req).isAdmin) {
        return next()
      }
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/admin/signin')
  }

  //Admin
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:id', authenticatedAdmin)
  app.get('admin/users', authenticatedAdmin)

  //User
  app.get('/signup', userController.signupPage)
  app.post('/signup', userController.signup)
  app.get('/signin', userController.signinPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
  app.get('/users/:userId/setting', authenticatedGeneral, userController.userSetting)
  app.put('/users/:userId/setting', authenticatedGeneral, userController.putUserSetting)
  app.get('/users/:userId/edit', authenticatedGeneral)
  app.post('/users/:userId/edit', authenticatedGeneral)
  app.get('/users/:userId/tweets', authenticatedGeneral)
  app.get('/users/:userId/replies', authenticatedGeneral)
  app.get('/users/:userId/likes', authenticatedGeneral)
  app.get('/users/:userId/following', authenticatedGeneral)
  app.get('/users/:userId/follower', authenticatedGeneral)

  // Tweets
  app.get('/', authenticatedGeneral, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticatedGeneral, tweetController.getTweets)
  app.post('/tweets', authenticatedGeneral)
  app.get('/tweets/:tweetId/replies', authenticatedGeneral)
  app.post('/tweets/:tweetId/replies', authenticatedGeneral)

  // FollowerShip
  app.post('/follow/:userId', authenticatedGeneral)
  app.delete('/follow/:userId', authenticatedGeneral)
  app.get('follow/top', authenticatedGeneral)

  // Like
  app.post('/tweets/:tweetId/like', authenticatedGeneral)
  app.delete('/tweets/:tweetId/like', authenticatedGeneral)

  //登出
  app.get('/logout', userController.logout)
}
