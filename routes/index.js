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

  //user
  app.get('/setting', authenticatedUser, userController.getSetting)
  app.put('/setting', authenticatedUser, userController.putSetting)
  app.get('/users/noti/:id', authenticatedUser, userController.toggleNotice)
  app.get('/users/:id', authenticatedUser, userController.getProfile)
  app.put('/users/:id/edit', authenticatedUser, upload.fields([{
    name: 'cover', maxCount: 1
  }, {
    name: 'avatar', maxCount: 1
  }]), userController.putProfile)

  //follow function
  app.get('/users/:userId/followers', authenticatedUser, followController.getFollowers)
  app.get('/users/:userId/followings', authenticatedUser, followController.getFollowings)
  app.post('/followships/:userId', authenticatedUser, userController.addFollowing)
  app.delete('/followships/:userId', authenticatedUser, userController.removeFollowing)

  // like
  app.post('/like/:TweetId', authenticatedUser, userController.addLike)
  app.delete('/like/:TweetId', authenticatedUser, userController.removeLike)

  // admin
  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/tweets/:id', authenticatedAdmin, adminController.getTweet)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.get('/admin/users/:id', authenticatedAdmin, adminController.getUser)
  app.get('/admin/admins', authenticatedAdmin, adminController.getAdmins)
  app.get('/admin/profile', authenticatedAdmin, adminController.getProfile)
  app.get('/admin/profile/edit', authenticatedAdmin, adminController.getEditProfile)
  app.put('/admin/profile/edit', authenticatedAdmin, upload.single('img'), adminController.putProfile)

  app.get('/admin/signup', authenticatedAdmin, adminController.signUpPage)
  app.post('/admin/signup', authenticatedAdmin, adminController.signUp)
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
  app.get('/admin/signout', adminController.signOut)

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
