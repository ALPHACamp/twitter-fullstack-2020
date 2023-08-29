const express = require('express')

<<<<<<< HEAD:routes/pages/modules/admin.js
const userController = require('../../../controllers/pages/user-controller')
const adminController = require('../../../controllers/pages/admin-controller')
=======
const { adminJWTAuth, sendToken } = require('../../middlewares/auth')
const userController = require('../../controllers/pages/user-controller')
const adminController = require('../../controllers/pages/admin-controller')
>>>>>>> user:routes/modules/admin.js

// passport & auth
const { adminLocalAuth, authenticatedAdmin } = require('../../../middlewares/auth')

const router = express.Router()

// Tweets page
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweets)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)

// Users page
router.get('/users', authenticatedAdmin, adminController.getUsers)

// Signin
<<<<<<< HEAD:routes/pages/modules/admin.js
router.get('/signin', userController.getAdminSignInPage)
router.get('/logout', userController.adminLogout)
router.post('/signin', adminLocalAuth, userController.adminSignin)

// Main route
router.get('/', authenticatedAdmin, adminController.getAdminHomePage)
=======
router.get('/signin', adminJWTAuth, userController.getAdminSignInPage)
router.post('/signin', adminJWTAuth, sendToken, userController.adminSignin)

// Main route
router.get('/logout', userController.adminLogout)

router.get('/', adminJWTAuth, adminController.getAdminHomePage)
>>>>>>> user:routes/modules/admin.js

module.exports = router
