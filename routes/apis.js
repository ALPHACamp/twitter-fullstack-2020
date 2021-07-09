const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweetController')

router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
router.get('/tweet/:id', tweetController.getTweet)

module.exports = router