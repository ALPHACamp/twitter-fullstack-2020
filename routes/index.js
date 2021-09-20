const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const messageController = require('../controllers/messageController')
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imagesUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])
const passport = require('../config/passport')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

module.exports = (app, passport, io) => {
  const apiAuthenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  }

  const apiAuthenticatedAdmin = (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).role === 'admin') { return next() }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  }

  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        req.flash('error_messages', '賬號類型錯誤，請使用一般賬號登入')
        return res.redirect('/admin/tweets')
      }
      return next()
    }
    return res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      req.flash('error_messages', '賬號類型錯誤，請使用後台賬號登入')
      return res.redirect('/admin/signin')
    }
    res.redirect('/admin/signin')
  }

  app.get('/', authenticated, (req, res) => { return res.redirect('/tweets') })
  //admin pages
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  //user login 
  app.get('/', (req, res) => { return res.redirect('/tweets') })
  app.get('/signin', userController.loginPage)
  app.get('/signin/:type', userController.emailLoginPage)
  app.post('/signin', passport.authenticate('account-local', { failureRedirect: '/signin', failureFlash: true }), userController.login)
  app.post('/signin/email', passport.authenticate('email-local', { failureRedirect: '/signin/email', failureFlash: true }), userController.emailLogin)
  app.get('/signup', userController.registerPage)
  app.post('/signup', userController.register)
  app.get('/logout', userController.logout)

  //admin login
  app.get('/admin/signin', userController.adminLoginPage)
  app.post('/admin/signin', passport.authenticate('account-local', { failureRedirect: '/admin/signin', failureFlash: true }), userController.adminLogin)
  app.get('/admin/signin/:type', userController.adminEmailLoginPage)
  app.post('/admin/signin/email', passport.authenticate('email-local', { failureRedirect: '/admin/signin/email', failureFlash: true }), userController.adminEmailLogin)
  app.get('/admin/logout', userController.adminLogout)

  //tweet page
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.post('/tweets', authenticated, tweetController.postTweets)
  app.get('/tweets/:tweetId/replies', authenticated, tweetController.getReply)
  app.post('/tweets/:tweetId/replies', authenticated, tweetController.postReply)
  app.delete('/tweets/:tweetId', authenticated, tweetController.deleteTweet)
  app.delete('/tweets/:replyId/replies', authenticated, tweetController.deleteReply)
  app.put('/tweets/:tweetId', authenticated, tweetController.editTweet)
  app.put('/tweets/:replyId/replies', authenticated, tweetController.editReply)

  //Like
  app.post('/tweets/:tweetId/like', authenticated, userController.likeTweet)
  app.post('/tweets/:tweetId/unlike', authenticated, userController.unlikeTweet)
  app.post('/like/:replyId/replies', authenticated, userController.likeReply)
  app.delete('/like/:replyId/replies', authenticated, userController.dislikeReply)

  //Reply
  app.post('/replies/:replyId', authenticated, replyController.postReply)
  app.delete('/replies/:replyId', authenticated, replyController.deleteReply)
  app.put('/replies/:replyId', authenticated, replyController.editReply)

  //follow
  app.post('/followships', authenticated, userController.postFollowing)
  app.delete('/followships/:userId', authenticated, userController.deleteFollowing)

  app.get('/users/settings', authenticated, userController.getUserSettings)
  app.put('/users/settings/:id', authenticated, userController.putUserSettings)

  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
  app.get('/users/:userId/replies', authenticated, userController.getUserReplies)
  app.get('/users/:userId/likes', authenticated, userController.getUserLikes)
  app.get('/users/:userId/followers', authenticated, userController.getUserFollowers)
  app.get('/users/:userId/followings', authenticated, userController.getUserFollowings)
  app.put('/users/:userId', authenticated, imagesUpload, userController.putUserInfo)
  app.post('/users/:userId', authenticated, imagesUpload, userController.putUserInfo)
  app.get('/users/:userId', authenticated, userController.getUserInfo)
  app.get('/api/users/:userId', apiAuthenticated, userController.apiGetUserInfo)
  app.post('/api/users/:userId', apiAuthenticated, userController.apiPostUserInfo)
  app.post('/api/signin', userController.apiSignIn)

  app.get('/message', authenticated, messageController.getMessage)
  app.get('/message/:userId', authenticated, messageController.getPrivateMessage)
}
