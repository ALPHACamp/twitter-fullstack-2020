// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')




// 準備引入路由模組


router.get('/', (req, res) => res.send('Hello World!'))

router.get('/tweets', tweetController.getTweets)

router.get('/login', userController.signInPage)

router.get('/register', userController.signUpPage)

router.get('/admin/login', adminController.signInPage)
router.get('/admin/tweets', adminController.getTweets)
router.get('/admin/users', adminController.getUser)





// 匯出路由器
module.exports = router
