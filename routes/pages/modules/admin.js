const express = require('express')

const { adminJWTAuth, sendToken, isAuthenticated } = require('../../../middlewares/auth')
const userController = require('../../../controllers/pages/user-controller')
const adminController = require('../../../controllers/pages/admin-controller')

const router = express.Router()

router.get('/tweets', adminJWTAuth, adminController.getTweets)
router.get('/signin', isAuthenticated, userController.getAdminSignInPage)
router.get('/logout', userController.adminLogout)
router.post('/signin', adminJWTAuth, sendToken, userController.adminSignin)
router.get('/', adminJWTAuth, adminController.getAdminHomePage)

module.exports = router
