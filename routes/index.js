const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

const userController = require('../controllers/user-controller')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)

router.get('/', (req, res) => res.render('tweets')) // 專案初始測試路由
router.use('/', generalErrorHandler)

module.exports = router
