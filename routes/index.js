const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweet-controller') 
//admin routes 
const admin = require('./modules/admin')
router.use('/admin', admin)
//normal users
router.get('/main', tweetController.getMainPage) 

router.use('/', (req, res) => res.redirect('/main'))

module.exports = router