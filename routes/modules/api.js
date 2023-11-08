const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/users/:id', authenticated, userController.getEditApi)
router.post('/users/:id', authenticated, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.postEditApi)

module.exports = router
