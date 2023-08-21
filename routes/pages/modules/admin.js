const express = require('express')

const { adminLocalAuth, adminJWTAuth, sendToken, isAuthenticated } = require('../../../middlewares/auth')
const userController = require('../../../controllers/pages/user-controller')

const router = express.Router()
router.get('/signin', isAuthenticated, userController.getAdminSignInPage)
router.get('/logout', userController.adminLogout)
router.post('/signin', adminLocalAuth, sendToken, userController.adminSignin)
router.get('/', adminJWTAuth, userController.getAdminHomePage)
module.exports = router
