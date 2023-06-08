const express = require('express')
const router = express.Router()
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

// router.get('/signin',authenticatedAdmin,adminController.signIn)

module.exports = router