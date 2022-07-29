const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.get('/users/:id', apiController.getUserInfo)
router.post('/users/:id', apiController.postUser)
router.use('/', apiErrorHandler)

module.exports = router
