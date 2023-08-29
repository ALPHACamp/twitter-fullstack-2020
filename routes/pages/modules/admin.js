const express = require('express')

const userController = require('../../../controllers/pages/user-controller')
const adminController = require('../../../controllers/pages/admin-controller')

// passport & auth
const passport = require('../../../config/passport')
const { authenticatedAdmin } = require('../../../middlewares/auth')

const router = express.Router()

// Tweets page
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweets)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)

// Users page
router.get('/users', authenticatedAdmin, adminController.getUsers)

// Signin
router.get('/signin', userController.getAdminSignInPage)
router.get('/logout', userController.adminLogout)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.adminSignin)

// Main route
router.get('/', authenticatedAdmin, adminController.getAdminHomePage)

module.exports = router
