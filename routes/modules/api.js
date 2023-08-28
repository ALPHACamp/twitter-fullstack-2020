const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/users/:id', userController.getEditPage)
router.post('/users/:id', upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.editUser)

module.exports = router
