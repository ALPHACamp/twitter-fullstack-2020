const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/users/:id', upload.single('avatar'), userController.editProfile)
router.post('/users/:id',  upload.single('avatar'), userController.putProfile)

module.exports = router