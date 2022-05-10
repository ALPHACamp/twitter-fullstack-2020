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
router.use('/users', authenticated, admin)
// tweets 路由入口
router.use('/tweets', authenticated, admin)

// 以下註冊、登入、登出路由以及followships

router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', generalErrorHandler)
module.exports = router
