const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')
const { authenticated } = require('../../middleware/auth')



router.get('/users/:id', authenticated, apiController.getUser)
router.post('/users/:id', authenticated, apiController.putUser)

module.exports = router