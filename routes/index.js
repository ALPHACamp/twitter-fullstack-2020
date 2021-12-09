const helpers = require('../_helpers')
const passport = require('../config/passport')
const db = require('../models')
const User = db.User

const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')
const apiController = require('../controllers/apiController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  // AUTHENTICATION
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return res.redirect('/admin/tweets')
      }
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.redirect('back')
    }
    res.redirect('/admin/signin')
  }

  // ADMIN
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('admin-local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }), adminController.signIn)
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweets)
  // OTHERS

  // USER
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('user-local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/logout', userController.logout)
  app.get('/users/:id/followings', authenticated, userController.getFollowings)
  app.get('/users/:id/followers', authenticated, userController.getFollowers)
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/tweets', authenticated, userController.getUserTweets)
  app.get('/users/:id/likes', authenticated, userController.getLikes)
  app.put('/users/:id/edit', authenticated, upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]), userController.putUserProfile)

  // TWEET
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.get('/tweets/:id', authenticated, tweetController.getTweet)
  app.post('/tweets', authenticated, tweetController.postTweet)

  // REPLY
  app.post('/tweets/:id/replies', authenticated, replyController.postReply)
  app.get('/tweets/:id/replies' ,authenticated, replyController.getReply)

  // LIKE
  app.post('/tweets/:id/like', authenticated, likeController.postLike)
  app.post('/tweets/:id/unlike', authenticated, likeController.deleteLike)

  // FOLLOWSHIP
  app.post('/followships', authenticated, userController.addFollowing)
  app.delete('/followships/:id', authenticated, userController.removeFollowing)

  //API
  app.get('/api/users/:userId', authenticated, apiController.getUser)
  app.post('/api/users/:userId', authenticated, upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]), apiController.postUser,userController.getUser)
}