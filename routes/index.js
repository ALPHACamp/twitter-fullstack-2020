const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/admin-controller')
const followshipController = require('../controllers/followship-controller')
const profileController = require('../controllers/profile-controller')
const userController = require('../controllers/user-controller')
const tweetsController = require('../controllers/tweets-controller')

const { authenticated, adminAuthenticated } = require('../middleware/auth')

// signin
router.get('/signin', userController.signinPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signin
)

// signup
router.get('/signup', userController.signupPage)
router.post(
  '/signup',
  passport.authenticate('local', {
    failureRedirect: '/signup',
    failureFlash: true
  }),
  userController.signup
)

// admin
router.get('/admin/signin', adminController.adminSigninPage)
router.get('/admin/tweets', adminAuthenticated, (req, res) =>
  res.render('admin/tweets')
)

// index
router.get('/tweets', authenticated, (req, res) => res.render('index'))

router.get('/users/:id/tweets', profileController.getUserTweets)
router.get('/users/:id/followings', profileController.getUserFollows)
router.get('/users/:id/followers', profileController.getUserFollows)
router.get('/users/:id', profileController.editUser)

router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
