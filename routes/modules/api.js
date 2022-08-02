const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticatedLimit } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/users/:id', authenticatedLimit, apiController.getUserInfo)

router.post(
  '/users/:id',
  authenticatedLimit,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  apiController.postUser
)

router.use('/', apiErrorHandler)

module.exports = router
