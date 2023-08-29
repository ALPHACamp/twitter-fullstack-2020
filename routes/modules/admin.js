const express = require('express')

const { adminJWTAuth, sendToken } = require('../../middlewares/auth')
const userController = require('../../controllers/pages/user-controller')
const adminController = require('../../controllers/pages/admin-controller')

const router = express.Router()

// Tweets page
router.delete('/tweets/:id', adminJWTAuth, adminController.deleteTweets)
router.get('/tweets', adminJWTAuth, adminController.getTweets)

// Users page
router.get('/users', adminJWTAuth, adminController.getUsers)

// Signin
router.get('/signin', adminJWTAuth, userController.getAdminSignInPage)
router.post('/signin', adminJWTAuth, sendToken, userController.adminSignin)

// Main route
router.get('/logout', userController.adminLogout)

router.get('/', adminJWTAuth, adminController.getAdminHomePage)

module.exports = router
