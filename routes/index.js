const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/', (req, res) => res.render('index'))

router.use('/', generalErrorHandler)

module.exports = router