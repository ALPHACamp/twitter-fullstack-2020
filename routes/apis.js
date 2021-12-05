const express = require('express')
const router = express.Router()

const userController = require('../controllers/api/userController')

router.get('/users/:userId', userController.getEditModal)

module.exports = router
