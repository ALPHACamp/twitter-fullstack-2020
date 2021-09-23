const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')

router.get('/admin', adminController.getTweets)

module.exports = router