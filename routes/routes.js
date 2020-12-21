const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const twitterController = require('../controllers/twitterController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const helplers = require('../_helpers')
const { authenticatedUser, authenticatedAdmin, isOwnProfile, editOwnProfile } = require('../middleware/check-auth')

const passport = require('../config/passport')
const user = require('../models/user.js')




/// ////
// admin
<<<<<<< HEAD
///////
router.get('/admin/signin', adminController.signinPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), authenticatedAdmin, adminController.signin)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
=======
/// ////
router.get('/admin/signin', adminController.signin)
>>>>>>> layout

/// ////
// User
<<<<<<< HEAD
///////
=======
/// ////
>>>>>>> layout
// router.get('/', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticatedUser, userController.signIn)

router.get('/user/setting', authenticatedUser, userController.getSetting)
router.put('/user/setting', authenticatedUser, userController.updateSetting)

router.get('/user/:id', authenticatedUser, userController.getUserProfile)

/// ////
// tweet
<<<<<<< HEAD
///////
router.get('/tweets', authenticatedUser, twitterController.getTwitters)
=======
/// ////
router.get('/tweets', twitterController.getTwitters)
>>>>>>> layout

module.exports = router
