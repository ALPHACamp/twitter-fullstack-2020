const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const followshipController = require('../controllers/followshipController')
const pageController = require('../controllers/pageController')

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

// 首頁
router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, pageController.getIndex)
// tweet 動作
router.post('/tweets', authenticated, tweetController.addTweet)
router.get('/tweets/:tweetId', authenticated, tweetController.getTweet)
router.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
router.post('/tweets/:tweetId/unlike', authenticated, tweetController.removeLike)
router.get('/tweets/:tweetId/replies', authenticated, replyController.getReplies)
router.post('/tweets/:tweetId/replies', authenticated, replyController.addReply)
// user 頁面
router.get('/users/:userId/settings', authenticated, pageController.getSettings)
router.get('/users/:userId/tweets', authenticated, pageController.getUserTweets)
router.get('/users/:userId/replies', authenticated, pageController.getUserReplies)
router.get('/users/:userId/likes', authenticated, pageController.getUserLikes)
router.get('/users/:userId/followers', authenticated, pageController.getUserFollowers)
router.get('/users/:userId/followings', authenticated, pageController.getUserFollowings)
// user 動作
router.put('/users/:userId/settings', authenticated, userController.updateSettings)
router.put('/users/:userId/settings', authenticated, userController.updateSettings)
router.post('/followships', authenticated, followshipController.addFollow)
router.delete('/followships/:userId', authenticated, followshipController.removeFollow)
// admin 相關不另外寫在 pageController
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticatedAdmin, adminController.adminUsers)
// authentication 頁面
router.get('/signup', pageController.getSignUp)
router.get('/signin', pageController.getSignIn)
router.get('/admin/signin', pageController.getSignIn)
// authentication 動作
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signout', userController.signOut)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), userController.signIn)
router.get('/admin/signout', userController.signOut)

module.exports = router
