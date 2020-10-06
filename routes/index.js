const tweetsController = require('../controllers/tweetsController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const replyController = require('../controllers/replyController.js')
const passport = require('../config/passport')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

module.exports = app => {
  // ====================tweets======================================
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, userController.getTopUsers, tweetsController.getTweets)
  app.post('/tweets', authenticated, tweetsController.postTweets)

  app.get('/tweets/:id/replies', authenticated, userController.getTopUsers, replyController.getReplylist)
  app.post('/tweets/:id/replies', authenticated, replyController.postReply)

  app.post('/tweets/:id/like', authenticated, replyController.addLike)
  app.post('/tweets/:id/unlike', authenticated, replyController.removeLike)
  app.delete('/tweets/:id/unlike', authenticated, replyController.removeLike)

  // =====================admin====================================
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

  // ================signup/signin======================================
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), authenticatedAdmin, adminController.signIn)
  app.get('/admin/logout', adminController.logout)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticated, userController.signIn)
  app.get('/logout', userController.logout)

  // ================register====================================
  app.get('/signup', userController.registerPage)
  app.post('/signup', userController.register)

  // =====================user====================================
  app.get('/users/:id/tweets', authenticated, userController.getTopUsers, userController.getUserTweets)
  app.get('/setting/:id', authenticated, userController.getSetting)
  app.put('/setting/:id', authenticated, userController.putSetting)
  app.post('/users/:id/edit', authenticated, userController.putUser)
  app.get('/users/:id/followers', authenticated, userController.getTopUsers, userController.getFollower)
  app.get('/users/:id/followings', authenticated, userController.getTopUsers, userController.getFollowing)
  app.post('/followships', authenticated, userController.addFollowing)
  app.delete('/followships/:followingId', authenticated, userController.removeFollowing)
  app.get('/users/:id/likes', authenticated, userController.getUserLikes)
}
