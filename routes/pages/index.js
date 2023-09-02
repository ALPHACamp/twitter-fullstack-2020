const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const admin = require('./modules/admin')
const followships = require('./modules/followships')
const tweets = require('./modules/tweets')
const users = require('./modules/users')

// Controllers
const adminController = require('../../controllers/pages/admin-controller')
const userController = require('../../controllers/pages/user-controller')

// middleware
const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticated, adminAuthenticated } = require('../../middleware/auth')

// admin signin
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('adminSignin', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

// user signup
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// user signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('userSignin', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// user logout
router.get('/logout', userController.logout)

// admin route
router.use('/admin', adminAuthenticated, admin)

// followship oute
router.use('/followships', authenticated, followships)

// tweets route
router.use('/tweets', authenticated, tweets)

// followships route
router.use('/followships', authenticated, followships)

// users route


router.use('/users', authenticated, users)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router