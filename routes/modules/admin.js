const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/twitters', adminController.getTwitters)
router.use('/', (req, res) => res.redirect('/admin/twitters'))

module.exports = router
