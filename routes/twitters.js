const express = require('express')
const router = express()

const twitterController = require('../controllers/twitterController.js')

router.get('/', twitterController.getTwitters)


module.exports = router