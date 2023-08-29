const express = require('express')

const { adminJWTAuth, sendToken } = require('../../middlewares/auth')
const userController = require('../../controllers/pages/user-controller')
const adminController = require('../../controllers/pages/admin-controller')

const router = express.Router()

router.get('/users', adminJWTAuth, adminController.getUsers)
router.get('/tweets', adminJWTAuth, adminController.getTweets)

router.get('/signin', adminJWTAuth, userController.getAdminSignInPage)
router.post('/signin', adminJWTAuth, sendToken, userController.adminSignin)

router.get('/logout', userController.adminLogout)

router.get('/', adminJWTAuth, adminController.getAdminHomePage)

module.exports = router
