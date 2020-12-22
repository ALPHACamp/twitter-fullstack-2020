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
router.post('/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.updateProfile)



module.exports = router