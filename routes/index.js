const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    return res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.redirect('/tweets')
    }
    return res.redirect('/admin/signin')
  }

  // user 相關
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)

  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
  app.get('/users/:userId/replies', authenticated, userController.getUserReplies)
  app.get('/users/:userId/likes', authenticated, userController.getUserLikes)

  app.get('/users/:userId/edit', authenticated, userController.editUserPage)
  app.put('/users/:userId', authenticated, userController.putUser)

  // tweet 相關
  app.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
  app.post('/tweets/:tweetId/unlink', authenticated, tweetController.removeLike)


  // user 登入、登出、註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/signout', userController.signOut)

  // admin 登入、登出
  app.get('/admin/signin', userController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), userController.signIn)
  app.get('/admin/signout', userController.signOut)

  // admin 相關
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.adminUsers)
}
