const express = require('express')
const router = express.Router()
// 引入Controller
const userController = require('../controllers/user-controller')

// 引入Modules
const tweetController = require('../controllers/tweet-controller')
const admin = require('./modules/admin')
// 使用Modules
router.get('/', tweetController.getTweets)
router.use('/admin', admin)

// 路由: GET 註冊頁
router.get('/signup', userController.signUpPage)
// 路由: POST 註冊
router.post('/signup', userController.signUp)
// 路由: GET 註冊頁
router.get('/signin', userController.signInPage)

module.exports = router