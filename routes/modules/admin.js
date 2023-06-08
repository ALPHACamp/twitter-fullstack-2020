const express = require('express')
const router = express.Router()
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

// 後台登入
router.get('/signin', adminController.signInPage)
router.post('/signin', authenticatedAdmin, adminController.signIn)

module.exports = router