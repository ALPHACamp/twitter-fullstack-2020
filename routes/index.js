const express = require('express')
const router = express.Router()
// 引入Controller
const userController = require('../controllers/user-controller')

// 引入Modules

// 使用Modules

// 路由: GET 註冊頁
router.get('/signup',userController.signUpPage)
// 路由: POST 註冊
router.post('/signup', userController.signUp)

module.exports = router