const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const twitterController = require('../controllers/twitterController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helplers = require('../_helpers')
// const { authenticated, authenticatedAdmin, isOwnProfile, editOwnProfile } = require('../middleware/check-auth')

const passport = require('../config/passport')

/// ////
// admin
/// ////
router.get('/admin/signin', adminController.signin)

/// ////
// User
/// ////
// router.get('/', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

/// ////
// tweet
/// ////
router.get('/tweets', twitterController.getTwitters)

module.exports = router
