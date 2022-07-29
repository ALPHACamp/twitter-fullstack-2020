const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticatedLimit } = require('../../middleware/auth')

router.get('/users/:id', authenticatedLimit, apiController.getUserInfo)
router.post('/users/:id', authenticatedLimit, apiController.postUser)
router.use('/', apiErrorHandler)

module.exports = router
