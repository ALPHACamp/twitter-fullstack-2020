const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const replies = require('./modules/replies')
// Controllers
const adminController = require('../../controllers/pages/admin-controller')
const userController = require('../../controllers/pages/user-controller')

// middleware
const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticated, adminAuthenticated } = require('../../middleware/auth')

// admin signin
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('adminSignin', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.use('/admin', adminAuthenticated, admin)

// user signup
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// user signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('userSignin', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// user logout
router.get('/logout', userController.logout)

// tweets route
router.use('/tweets', authenticated, tweets)

// replies route
router.use('/replies', authenticated, replies)

// users route
router.use('/users', authenticated, users)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
