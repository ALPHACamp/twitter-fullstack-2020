const express = require('express')
const router = express.Router()
const { authenticatedAdmin } = require('../../middleware/auth')
//admin/login 

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))

module.exports = router