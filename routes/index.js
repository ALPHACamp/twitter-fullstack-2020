const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)



router.get('/', (req, res) => res.render('tweets')) // 專案初始測試路由

router.use('/', generalErrorHandler)

module.exports = router
