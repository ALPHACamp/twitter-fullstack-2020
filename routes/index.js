const express = require('express')
const loginController = require('../controllers/login-controller')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin.js')
const home = require('./modules/home.js')
const users = require('./modules/users.js')

router.use('/admin', admin)
router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logout)
router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)
router.use('/users', users)
router.get('/tweets', authenticated, (req, res) => {
  res.render('tweets')
})
router.use('/', authenticated, home)
router.use('/', generalErrorHandler)

module.exports = router
