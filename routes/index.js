const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')

// const { authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', generalErrorHandler)

module.exports = router
