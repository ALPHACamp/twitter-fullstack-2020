const express = require('express')
const router = express.Router()

const apiController = require('../../../controllers/pages/api-controller')

router.get('/:id', apiController.getUserEditPage)
router.post('/:id', apiController.postUserInfo)

module.exports = router
