const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/admin-controller')
const followshipController = require('../controllers/followship-controller')
const profileController = require('../controllers/profile-controller')
const userController = require('../controllers/user-controller')
const tweetsController = require('../controllers/tweets-controller')

const { authenticated, adminAuthenticated } = require('../middleware/auth')

router.get('/signin', userController.signinPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signin
)

//router.get('/tweets', authenticated, (req, res) => res.render('index'))

router.get('/users/:id/tweets', profileController.getUserTweets)
router.get('/users/:id/followings', profileController.getUserFollows)
router.get('/users/:id/followers', profileController.getUserFollows)
router.get('/users/:id', profileController.editUser)
router.get('/tweets', tweetsController.getTweets)
router.get('/tweet', tweetsController.getTweet)

router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
