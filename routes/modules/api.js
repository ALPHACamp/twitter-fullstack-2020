const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')

const apiController = require('../../controllers/api-controller')

router.get('/users/:id', apiController.getUserInfo)
router.post(
  '/users/:id',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]),
  apiController.postUserInfo
)

module.exports = router
