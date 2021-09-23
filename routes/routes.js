const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

const authenticatedGeneral = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).isAdmin) {
      return next()
    }
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/admin/signin')
}

//Admin
router.get('/admin/signin', adminController.signinPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin)
router.get('admin/users', authenticatedAdmin)

//User
router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)
router.get('/signin', userController.signinPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
router.get('/users/:userId/setting', authenticatedGeneral, userController.userSetting)
router.put('/users/:userId/setting', authenticatedGeneral, userController.putUserSetting)
router.get('/users/:userId/edit', authenticatedGeneral)
router.post('/users/:userId/edit', authenticatedGeneral)
router.get('/users/:userId/tweets', authenticatedGeneral)
router.get('/users/:userId/replies', authenticatedGeneral)
router.get('/users/:userId/likes', authenticatedGeneral)
router.get('/users/:userId/following', authenticatedGeneral)
router.get('/users/:userId/follower', authenticatedGeneral)

// Tweets
router.get('/', authenticatedGeneral, (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticatedGeneral, tweetController.getTweets)
router.post('/tweets', authenticatedGeneral)
router.get('/tweets/:tweetId/replies', authenticatedGeneral)
router.post('/tweets/:tweetId/replies', authenticatedGeneral)

// FollowerShip
router.post('/follow/:userId', authenticatedGeneral)
router.delete('/follow/:userId', authenticatedGeneral)
router.get('follow/top', authenticatedGeneral)

// Like
router.post('/tweets/:tweetId/like', authenticatedGeneral)
router.delete('/tweets/:tweetId/like', authenticatedGeneral)

//登出
router.get('/logout', userController.logout)

module.exports = router
