const express = require('express')
const router = express.Router()

const apiController = require('../../controllers/api-controller')

router.get('/users/:id', apiController.getUserInfo)
router.post('/users/:id', apiController.postUserInfo)

module.exports = router
