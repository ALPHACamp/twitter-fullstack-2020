const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../controllers/user-controller')

const { authenticator } = require('../middleware/auth')
const { generalErrorHandler, apiErrorHandler } = require('../middleware/error-handler')

const users = require('./modules/users')
const tweets = require('./modules/tweets')
const admin = require('./modules/admin')

router.use('/users', authenticator, users)
router.use('/tweets', authenticator, tweets)
router.use('/admin', admin)
router.get('/api/users/:id', authenticator, userController.getUserData)
router.post('/api/users/:id', authenticator, userController.editUserProfile)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.post('/followships', userController.addFollow)
router.delete('/followships/:id', userController.removeFollow)
router.get('/logout', userController.logout)
router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/api', apiErrorHandler)
router.use('/', generalErrorHandler)

module.exports = router
