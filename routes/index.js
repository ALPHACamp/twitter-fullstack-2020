const helpers = require('../_helpers')
const passport = require('../config/passport')
const db = require('../models')
const User = db.User

const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const { authenticate } = require('passport')
const likeController = require('../controllers/likeController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // ADMIN
  app.get('/admin/signin', adminController.signInPage)
  app.post('/admin/signin', adminController.signIn)
  app.get('/admin/tweets', adminController.getTweets)
  app.get('/admin/users', adminController.getUsers)
  app.delete('/admin/tweets/:id', adminController.deleteTweets)
  // OTHERS

  // USER
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin', failureFlash: true
  }), userController.signIn)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/logout', userController.logout)
  app.get('/users/:id', authenticated, userController.getUser)

  // TWEET
  app.get('/', (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.get('/tweets/:id', authenticated, tweetController.getTweet)
  app.post('/tweets', authenticated, tweetController.postTweet)

  // REPLY

  // LIKE
  app.post('/tweets/:id/like', authenticated, likeController.postLike)
  app.post('/tweets/:id/unlike', authenticated, likeController.deleteLike)
  // FOLLOWSHIP
}