const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/userController.js')

router.get('/admin/restaurants')

module.exports = router
