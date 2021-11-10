const express = require('express');
const router = express.Router();

const passport = require('../config/passport')

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const helpers = require('../_helpers')
const replyController = require('../controllers/replyController')
const messageController = require('../controllers/messageController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role !== 'admin') { return next() }
    req.flash('error_messages', '此帳號為管理者帳號，不可登入前台！')
    return res.redirect('/admin/tweets')
  }
  return res.redirect('/tweets')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    req.flash('error_messages', '此帳號非管理者帳號！')
    return res.redirect('/admin/signin')
  }
  res.redirect('/admin/signin')
}

// 使用 authenticated 取代原來 authenticatedUser，與api統一

router.get('/tweets/:id/replies', authenticated, tweetController.getTweet)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.post('/tweets', authenticated, tweetController.postTweet)
router.post('/tweets/:TweetId/like', authenticated, userController.addLike)
router.post('/tweets/:TweetId/unlike', authenticated, userController.removeLike)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signout', userController.logout)

router.get('/setting', authenticated, userController.getSetting)
router.put('/setting', authenticated, userController.putSetting)

router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/tweets', authenticated, userController.getProfile)
router.get('/users/:id/likes', authenticated, userController.getProfile)
router.get('/users/:id', authenticated, userController.getProfile)
router.put('/users/:id/edit', authenticated, upload.fields([{
  name: 'cover', maxCount: 1
}, {
  name: 'avatar', maxCount: 1
}]), userController.putProfile)

router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:userId', authenticated, userController.removeFollowing)

router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/admin/logout', adminController.logout)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

router.get('/messages/public', authenticated, messageController.getPublic)

router.get('/', (req, res) => res.redirect('/signin'))

module.exports = router