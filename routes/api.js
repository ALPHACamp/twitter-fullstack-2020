const express = require('express')
const router = express.Router()
const apiController = require('../controllers/apiController')

router.get('/users/:id', apiController.getUser)
router.post('/users/:id', apiController.putUser)


module.exports = router