const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

// 取得特定使用者頁面
router.get('/:id/tweets', userController.getUserPage)

module.exports = router
