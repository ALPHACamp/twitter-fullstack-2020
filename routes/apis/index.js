const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/apis/tweet-controller')

router.get('/tweets/:id', tweetController.getTweet)

module.exports = router
