const express = require('express')
const router = express.Router()

const userController = require('../../controllers/apis/user-controller')
const upload = require('../../middleware/multer')

router.get('/users/:userId', userController.getUser)
router.post('/users/:userId', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.postUser)

module.exports = router
