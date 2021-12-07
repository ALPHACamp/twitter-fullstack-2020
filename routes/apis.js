const express = require('express')
const router = express.Router()

const userController = require('../controllers/api/userController')

router.get('/users/:userId', userController.getEditModal)
router.post('/users/:userId', userController.updateUser) // 更新使用者的資訊

module.exports = router
