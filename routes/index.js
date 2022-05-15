const express = require('express')
const loginController = require('../controllers/login-controller')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin.js')
const tweets = require('./modules/tweets.js')
const users = require('./modules/users.js')

router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logout)
router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)

router.use('/admin', admin)
router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)
router.use('/', generalErrorHandler)

module.exports = router
