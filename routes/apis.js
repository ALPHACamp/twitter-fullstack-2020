const express = require('express')
const router = express.Router()
const userController = require('../controllers/api/userController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const { authenticatedUser, authenticatedAdmin, isOwnProfile, editOwnProfile } = require('../middleware/check-auth')

///////
// User
///////
router.get('/users/:id', userController.userProfile)



module.exports = router