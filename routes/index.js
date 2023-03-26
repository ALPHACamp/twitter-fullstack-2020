const express = require('express')
const router = express.Router()
const mainPageController = require('../controllers/mainPage-controller') 
//admin routes 
const admin = require('./modules/admin')
router.use('/admin', admin)
//normal users
router.get('/main', mainPageController.getMainPage) 

router.use('/', (req, res) => res.redirect('/main'))

module.exports = router