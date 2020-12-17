const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const twitterController = require('../controllers/twitterController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')
// const { authenticated, authenticatedAdmin, isOwnProfile, editOwnProfile } = require('../middleware/check-auth')

const passport = require('../config/passport')
const user = require('../models/user.js')

// const authenticated = passport.authenticate('jwt', { session: false })

const authenticated = (req, res, next) => {
  console.log(req.user)
  if (req.user) {
    return next()
  }
  res.redirect('/admin/signin')
}

authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.redirect('/admin/signin')
  } else {
    return res.redirect('/admin/signin')
  }
}

///////
// admin
///////
router.get('/admin/signin', adminController.signinPage)
router.post('/admin/signin', adminController.signin)
router.get('/admin/tweets', passport.authenticate('jwt', { session: false }), authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', adminController.deleteTweet)
router.get('/admin/users', adminController.getUsers)

///////
// User
///////
// router.get('/', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/user/setting', userController.getSetting)
router.put('/user/setting', userController.updateSetting)

///////
// tweet
///////
router.get('/tweets', twitterController.getTwitters)

module.exports = router