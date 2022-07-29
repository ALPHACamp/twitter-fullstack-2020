const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')

router.get('/users/:id', apiController.getUserInfo)

module.exports = router
