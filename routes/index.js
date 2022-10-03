const express = require('express')
const router = express.Router()

const twitterController = require('../controllers/twitter-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/twitters', twitterController.getTwitters)
router.use('/', (req, res) => res.redirect('/twitters'))

module.exports = router
