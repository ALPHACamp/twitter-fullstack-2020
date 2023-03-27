const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/pages/admin/admin-controller')
router.get('/admin_main', adminController.getMainPage)
//須補"後台登入"
router.use('/', (req, res) => res.redirect('/admin/admin_main'))
module.exports = router