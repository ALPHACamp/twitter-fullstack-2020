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


// const authenticated = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     return next()
//   }
//   res.redirect('/signin')
// }
// const authenticatedAdmin = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     if (helpers.getUser(req).role === 'admin') {
//       return next()
//     }
//     req.flash('error_messages', '此帳號非管理者帳號！')
//     return res.redirect('/admin/signin')
//   }
//   res.redirect('/admin/signin')
// }
// const authenticatedUser = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     if (helpers.getUser(req).role !== 'admin') { return next() }
//     req.flash('error_messages', '此帳號為管理者帳號，不可登入前台！')
//     return res.redirect('/signin')
//   }
//   res.redirect('/signin')
// }

// router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
// router.get('/tweets', authenticatedUser, tweetController.getTweets)
// router.post('/tweets', authenticated, tweetController.postTweet)
// router.get('/tweets/:id', authenticatedUser, tweetController.getTweet)

// router.post('/tweets/:id/replies', authenticatedUser, replyController.postReply)

// router.post('/tweets/:TweetId/like', authenticatedUser, userController.addLike)
// router.post('/tweets/:TweetId/unlike', userController.removeLike)

// router.get('/signup', userController.signUpPage)
// router.post('/signup', userController.signUp)
// router.get('/signin', userController.signInPage)
// router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
// router.get('/signout', userController.logout)

// router.get('/setting', authenticatedUser, userController.getSetting)
// router.put('/setting', authenticatedUser, userController.putSetting)

// router.get('/users/noti/:id', authenticatedUser, userController.toggleNotice)
// router.get('/users/:id/tweets', authenticatedUser, userController.getProfile)
// router.get('/users/:id/likes', authenticatedUser, userController.getProfile)
// router.put('/users/:id/edit', authenticatedUser, upload.fields([{
//   name: 'cover', maxCount: 1
// }, {
//   name: 'avatar', maxCount: 1
// }]), userController.putProfile)


// router.get('/admin/signin', adminController.signInPage)
// router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
// router.get('/admin/logout', adminController.logout)
// router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
// router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
// router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

// router.post('/followships/:userId', authenticatedUser, userController.addFollowing)
// router.delete('/followships/:userId', authenticatedUser, userController.removeFollowing)
// router.get('/users/:id/followers', authenticatedUser, userController.getFollowers)
// router.get('/users/:id/followings', authenticatedUser, userController.getFollowings)

// router.get('/messages/public', authenticatedUser, messageController.getPublic)

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
      req.flash('error_messages', '此帳號非管理者帳號！')
      return res.redirect('/admin/signin')
  }
  res.redirect('/admin/signin')
}
const authenticatedUser = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role !== 'admin') { return next() }
      req.flash('error_messages', '此帳號為管理者帳號，不可登入前台！')
      return res.redirect('/admin/tweets')
  }
  return res.redirect('/tweets')
}

// for test
router.get('/tweets/:id/replies', authenticatedUser, tweetController.getTweet)
// for test尾
router.get('/tweets/:id', authenticatedUser, tweetController.getTweet)
router.get('/tweets', authenticatedUser, tweetController.getTweets)
router.post('/tweets/:id/replies', replyController.postReply)
router.post('/tweets',  authenticated ,tweetController.postTweet)
router.post('/tweets/:TweetId/like', authenticatedUser, userController.addLike)
router.post('/tweets/:TweetId/unlike', userController.removeLike)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signout', userController.logout)

router.get('/setting', authenticatedUser, userController.getSetting)
router.put('/setting', authenticatedUser, userController.putSetting)

router.get('/users/:id/followers', authenticatedUser, userController.getFollowers)
router.get('/users/:id/followings', authenticatedUser, userController.getFollowings)
router.get('/users/:id', authenticatedUser, userController.getProfile)
router.get('/users/noti/:id', authenticatedUser, userController.toggleNotice)
router.get('/users/:id/tweets', authenticatedUser, userController.getProfile)
router.get('/users/:id/likes', authenticatedUser, userController.getProfile)
router.put('/users/:id/edit', authenticatedUser, upload.fields([{
  name: 'cover', maxCount: 1
}, {
  name: 'avatar', maxCount: 1
}]), userController.putProfile)
router.post('/followships', authenticatedUser, userController.addFollowing)
router.delete('/followships/:userId', authenticatedUser, userController.removeFollowing)

router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/admin/logout', adminController.logout)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

router.get('/', authenticated, (req, res) => res.redirect('/tweets'))

module.exports = router