const express = require('express')
const router = express.Router()
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin
//admin/login 

router.get('/', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))

module.exports = router