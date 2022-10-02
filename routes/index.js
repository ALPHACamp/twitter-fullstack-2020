const express = require('express')
const router = express.Router()

const twitterController = require('../controllers/twitter-controller') 

router.get('/twitters', twitterController.getTwitters)
router.use('/', (req, res) => res.redirect('/twitters'))

module.exports = router
