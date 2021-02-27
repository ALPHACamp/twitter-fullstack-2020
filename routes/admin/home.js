const express = require('express')
const router = express.Router()
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin
const adminController = require('../../controllers/adminController')
//admin/login 
router.get('/signin', adminController.signInPage)
router.get('/', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))

module.exports = router