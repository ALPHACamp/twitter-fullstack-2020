const express = require('express')
const router = express.Router()
const authenticatedAdmin = require('../../_helpers').authenticatedAdmin
const adminController = require('../../controllers/adminController')
//admin/user
router.get('/', adminController.getUsers)

module.exports = router