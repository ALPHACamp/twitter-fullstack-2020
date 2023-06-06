const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweet-controller')

const { authenticator } = require('../middleware/auth')

router.get('/', tweetController.getTweets)

module.exports = router
