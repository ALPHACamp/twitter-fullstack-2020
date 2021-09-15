const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const helpers = require('../_helpers')

const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')
const loginController = require('../controllers/loginController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

// User
// signin
router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)

router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logOut)

// tweets
router.get('/', (req, res) => res.redirect('/tweets'))
router.get('/tweets', tweetController.getTweets)




// Admin
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', adminController.signIn)
router.get('/admin/tweets', adminController.getTweets)
router.get('/admin/users', adminController.getUsers)


module.exports = router