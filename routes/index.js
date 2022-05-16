const express = require('express')
const loginController = require('../controllers/login-controller')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin.js')
const tweets = require('./modules/tweets.js')
const users = require('./modules/users.js')
const api = require('./modules/api.js')

router.use('/admin', admin)
router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logout)
router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)

router.delete('/followships/:userId', authenticated, userController.removeFollowing)
router.post('/followships', authenticated, userController.addFollowing)

router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)

router.use('/api/users', api)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
