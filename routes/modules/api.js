const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const apiController = require('../../controllers/api-controller')


router.post('/image', upload.fields([
  { name: 'avatar' },
  { name: 'cover' }
]), apiController.uploadImage)

router.get('/users/:uid', apiController.getUserProfile)
router.post('/users/:uid', apiController.putUserProfile)


module.exports = router