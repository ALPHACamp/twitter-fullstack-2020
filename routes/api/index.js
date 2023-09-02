const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/apis/tweet-controller')

// const { authenticated } = require('../../middleware/auth')

router.get('/tweets/:id', tweetController.getTweet)

module.exports = router