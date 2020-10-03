const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')

const helpers = require('../_helpers');

const helpers = require('../_helpers');

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role === 'user') { return next() }
    }
    req.flash('error_messages', '錯誤賬號類型，請使用後台登錄！')
    return res.redirect('/users/login')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      // console.log(req.user)
      if (req.user.role === 'admin') { return next() }
      return res.redirect('/users/login')
    }
    res.redirect('/users/login')
  }

  app.get('/', authenticated, (req, res) => { return res.redirect('/tweets') })
  //admin pages
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  //user login 
  app.get('/', (req, res) => { return res.redirect('/tweets') })
  app.get('/users/login', userController.loginPage)
  app.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
  app.get('/users/register', userController.registerPage)
  app.post('/users/register', userController.register)
  app.get('/users/logout', userController.logout)

  //admin login
  //app.get('/admin/login', adminController.adminLoginPage)
  //app.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.adminLogin)
  //app.get('/admin/logout', adminController.adminLogout)
  
  //tweet page
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.post('/tweets', authenticated, tweetController.postTweets)
  app.get('/tweets/:tweetId', authenticated, tweetController.getTweet)
  app.post('/tweets/:tweetId/replies', authenticated, tweetController.postReply)
  app.delete('/tweets/:tweetId', authenticated, tweetController.deleteTweet)
  app.delete('/tweets/:replyId/replies', authenticated, tweetController.deleteReply)
  app.put('/tweets/:tweetId', authenticated, tweetController.editTweet)
  app.put('/tweets/:replyId/replies', authenticated, tweetController.editReply)

  //Like
  app.post('/like/:tweetId', authenticated, userController.likeTweet)
  app.delete('/like/:tweetId', authenticated, userController.dislikeTweet)
  app.post('/like/:replyId/replies', authenticated,userController.likeReply)
  app.delete('/like/:replyId/replies', authenticated, userController.dislikeReply)

  //Reply
  app.post('/replies/:replyId', authenticated, replyController.postReply)
  app.delete('/replies/:replyId', authenticated, replyController.deleteReply)
  app.put('/replies/:replyId', authenticated, replyController.editReply)

  //follow
  app.post('/following/:userId', authenticated, userController.postFollowing)
  app.delete('/following/:userId', authenticated, userController.deleteFollowing)
  app.get('/admin/login', userController.adminLoginPage)
  app.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), userController.adminLogin)
  app.get('/admin/logout', userController.adminLogout)

  app.get('/tweets', tweetController.getTweets)
  app.get('/users/settings', authenticated, userController.getUserSettings)
  app.put('/users/settings/:id', authenticated, userController.putUserSettings)
  app.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
  app.get('/users/:userId/replies', authenticated, userController.getUserReplies)
  app.get('/users/:userId/likes', authenticated, userController.getUserLikes)
}