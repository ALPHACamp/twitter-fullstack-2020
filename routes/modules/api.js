const express = require('express')
const router = express.Router()
const apiProfileController = require('../../controllers/api-profile-controller')
const cpUpload = require('../../middleware/multer')

const { authenticated } = require('../../middleware/auth')

// api
router.use('/', authenticated)
router.get('/users/:userId', apiProfileController.editUserAccount)
router.post('/users/:userId', cpUpload, apiProfileController.putUserAccount)

module.exports = router
