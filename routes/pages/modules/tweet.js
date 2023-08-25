const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/pages/tweet-controller')
router.get('/', tweetController.getUserTweets)
module.exports = router
