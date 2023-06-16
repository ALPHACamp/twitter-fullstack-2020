const express = require('express')
const router = express.Router()
const apiProfileController = require('../../controllers/api-profile-controller')
const upload = require('../../middleware/multer')

const { authenticated } = require('../../middleware/auth')

// api
router.use('/', authenticated)
router.get('/users/:userId', apiProfileController.editUserAccount)
router.post(
  '/users/:userId',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  apiProfileController.putUserAccount
)

module.exports = router
