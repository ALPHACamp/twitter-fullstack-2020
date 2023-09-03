const express = require('express')
const router = express.Router()

const apiController = require('../../controllers/apis/api-controller')
const cpUpload = require('../../middlewares/multer')

router.get('/:id', apiController.getUserEditPage)
router.post('/:id', cpUpload, apiController.postUserInfo)

module.exports = router
