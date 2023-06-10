const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.getSignin)

module.exports = router