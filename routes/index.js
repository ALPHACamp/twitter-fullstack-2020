const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/admin-controller')
const followshipController = require('../controllers/followship-controller')
const profileController = require('../controllers/profile-controller')
const userController = require('../controllers/user-controller')
const tweetsController = require('../controllers/tweets-controller')

const { authenticated, adminAuthenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/signin', userController.signinPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signin
)

router.get('/tweets', authenticated, (req, res) => res.render('index'))

router.get('/users/:userId/tweets', authenticated, profileController.getUser, profileController.getUserTweets)
router.get('/users/:userId/followings', authenticated, profileController.getUserFollows)
router.get('/users/:userId/followers', authenticated, profileController.getUserFollows)
router.get('/users/:userId', authenticated, profileController.editUser)

router.use('/', (req, res) => res.redirect('/tweets'))

router.use('/', generalErrorHandler)

module.exports = router
