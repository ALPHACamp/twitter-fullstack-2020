const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController')

router.get('/admin', (req, res) => { res.redirect('/admin/main') })
router.get('/admin/main', adminController.getTweets)

module.exports = router