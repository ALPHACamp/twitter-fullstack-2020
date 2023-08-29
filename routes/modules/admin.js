const express = require('express')

const userController = require('../../../controllers/pages/user-controller')
const adminController = require('../../../controllers/pages/admin-controller')

// passport & auth
const { adminLocalAuth, authenticatedAdmin } = require('../../../middlewares/auth')

const router = express.Router()

// Tweets page
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweets)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)

// Users page
router.get('/users', authenticatedAdmin, adminController.getUsers)

// Signin
router.get('/signin', userController.getAdminSignInPage)
router.get('/logout', userController.adminLogout)
router.post('/signin', adminLocalAuth, userController.adminSignin)

// Main route
router.get('/', authenticatedAdmin, adminController.getAdminHomePage)

module.exports = router
