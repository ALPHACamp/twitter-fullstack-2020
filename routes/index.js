const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const adminController = require('../controllers/admin-controller')
const passport = require('../config/Passport')
const helpers = require('../_helpers')
const { generalErrorHandler } = require('../middleware/error-handler')

const adminAuthenticated = (req, res, next) => {
  if (
    helpers.ensureAuthenticated(req) &&
    (helpers.getUser(req).isAdmin || helpers.getUser(req).role)
  )
    return next();
  return res.redirect('/admin/signin');
};

const userAuthenticated = (req, res, next) => {
  if (
    helpers.ensureAuthenticated(req) &&
    !helpers.getUser(req).isAdmin &&
    !helpers.getUser(req).role
  )
    return next();
  if (
    helpers.ensureAuthenticated(req) &&
    (helpers.getUser(req).role || helpers.getUser(req).isAdmin)
  )
    return res.redirect('/admin/tweets');
  return res.redirect('/signin');
};

router.get('/admin/signin', adminController.getSigninPage);
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin' }), adminController.signin);
router.get('/admin/users', adminController.getUsers)
router.delete('/admin/tweets/:tweetId', adminController.deleteTweet)
router.get('/admin/tweets', adminController.getTweets);

router.get('/signin', userController.loginPage)
router.get('/signup', userController.registerPage)
router.post('/signup', userController.signup)
router.get('/api/users/:id', userController.settingPage)
router.get('/tweets/:id/replies', tweetController.getReplies)
router.post('/tweets/id/replies', tweetController.postReply)
router.post('/tweets/id/like', tweetController.addLike)
router.post('/tweets/id/unlike', tweetController.removeLike)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
router.get('/users/1/tweets', userController.getUser)
router.get('/users/1/followers', userController.getFollowers)
router.get('/users/1/followings', userController.getFollowings)
router.use('/', generalErrorHandler)
module.exports = router
