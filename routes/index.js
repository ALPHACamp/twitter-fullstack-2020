const express = require('express')
const router = express.Router()
const passport = require('passport')
const upload = require('../middleware/multer')

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// admin 路由入口
router.use('/admin', authenticatedAdmin, admin)

// users 路由入口
// router.use('/users', authenticated, users)
router.use('/users', users) // 暫時免去認證判斷

// tweets 路由入口
router.use('/tweets', authenticated, tweets)

// 以下註冊、登入、登出路由以及followships
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)

// fallback 路由
router.get('/', (req, res) => {
  res.redirect('/tweets')
})
router.use('/', generalErrorHandler)
module.exports = router
