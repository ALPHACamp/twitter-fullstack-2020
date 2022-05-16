const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/users/:id', upload.fields([{name: 'cover', maxCount: 1}, {name: 'avatar', maxCount: 1}]), userController.editUser)
router.put('/users/:id', upload.fields([{name: 'cover', maxCount: 1}, {name: 'avatar', maxCount: 1}]), userController.putUser)

module.exports = router