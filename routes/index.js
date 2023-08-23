const express = require('express')
const router = express.Router()
// 引入Controller
const userController = require('../controllers/user-controller')

// 引入Modules

// 使用Modules
router.get('/signup',userController.signUpPage)

module.exports = router