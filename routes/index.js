const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)

//* 追蹤功能
router.post('/followships/:userId', authenticated, userController.addFollowing)
router.delete(
  '/followships/:userId',
  authenticated,
  userController.removeFollowing
)
router.post('/tweets/:id/like', authenticated, userController.addLike)
router.delete('/tweets/:id/unlike', authenticated, userController.removeLike)
router.use('/', authenticated, generalErrorHandler)
router.get('/user', userController.getOther)

router.get('/tweets', tweetController.getTweets)
router.use('/', generalErrorHandler)

module.exports = router
