const helpers = require('../_helpers')
const passport = require('../config/passport')
const db = require('../models')
const User = db.User

const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.getUser(req).role === 'user') {
      req.flash('error_msg', '前台帳號不能登入後台')
      return res.redirect('/admin/signin')
    }
    if (helpers.getUser(req).role === 'admin') {
      if (helpers.ensureAuthenticated(req)) {
        return next()
      }
    }
    res.redirect('/admin/tweets')
  }

  const authenticatedUser = (req, res, next) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_msg', '後台帳號不能登入前台')
      return res.redirect('/admin/tweets')
    }
    if (helpers.getUser(req).role === 'user') {
      if (helpers.ensureAuthenticated(req)) {
        return next()
      }
    }
    res.redirect('/signin')
  }


  // ADMIN
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), authenticatedAdmin, adminController.signIn)
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweets)
  // OTHERS

  // TWEET
  app.get('/', authenticated, authenticatedUser, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticatedUser, tweetController.getTweets)
  app.get('/tweets/:id', authenticatedUser, tweetController.getTweet)
  app.post('/tweets', authenticatedUser, tweetController.postTweet)

  // REPLY

  // LIKE
  app.post('/tweets/:id/like', authenticatedUser, likeController.postLike)
  app.post('/tweets/:id/unlike', authenticatedUser, likeController.deleteLike)
  // FOLLOWSHIP

  // USER
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin', failureFlash: true
  }), authenticatedUser, userController.signIn)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/logout', userController.logout)
}