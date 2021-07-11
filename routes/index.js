const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const followController = require('../controllers/followController')

module.exports = (app, passport) => {
  const authenticatedUser = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (!helpers.getUser(req).is_admin) { return next() }
      req.flash('error_messages', '管理員請由後台登入')
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).is_admin) { return next() }
      req.flash('error_messages', '沒有權限')
      return res.redirect('/admin/signin')
    }
    res.redirect('/signin')
  }

  // follow function
  app.get('/users/:userId/follower', authenticatedUser, followController.getFollowing)
  app.get('/users/:userId/followering', authenticatedUser, followController.getFollower)
  app.get('/users/:id', authenticatedUser, userController.getUser)
  app.post('/following/:userId', authenticatedUser, userController.addFollowing)
  app.delete('/following/:userId', authenticatedUser, userController.removeFollowing)

  // like
  app.post('/like/:TweetId', authenticatedUser, userController.addLike)
  app.delete('/like/:TweetId', authenticatedUser, userController.removeLike)

  // admin
  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/signup', authenticatedAdmin, adminController.signUpPage)
  app.post('/admin/signup', authenticatedAdmin, adminController.signUp)
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), adminController.signIn)
  app.get('/signout', adminController.signOut)

  // signin & signup
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticatedUser, userController.signIn)
  app.get('/signout', userController.signOut)

  // tweets
  app.get('/tweets', authenticatedUser, tweetController.getTweets)
  app.get('/tweets/feeds', authenticatedUser, tweetController.getFeeds)
  app.get('/tweets/:id', authenticatedUser, tweetController.getTweet)
  app.get('/tweets/:id/edit', authenticatedUser, tweetController.editTweet)
  app.put('/tweets/:id', authenticatedUser, tweetController.putTweet)
  app.post('/tweets', authenticatedUser, tweetController.postTweet)
  app.delete('/tweets/:id', authenticatedUser, tweetController.deleteTweet)

  // reply
  app.post('/replies', authenticatedUser, replyController.postReply)
  app.delete('/replies/:id', authenticatedUser, replyController.deleteReply)

  // 首頁
  app.get('/', authenticatedUser, (req, res) => res.redirect('/tweets'))
}
