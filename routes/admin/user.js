const express = require('express')
const router = express.Router()
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin
const adminController = require('../../controllers/adminController')
//admin/user
router.get('/', authenticatedAdmin, adminController.getUsers)

module.exports = router