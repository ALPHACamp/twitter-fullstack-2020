const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// const helpers = require('../_helpers')
router.get('/signin', adminController.signInPage)
router.use('/', (req, res) => { res.redirect('/admin/signin') })

module.exports = router
