const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweetController')

router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
router.get('/tweets/:id', tweetController.getTweet)
router.post('tweets/:id/replies', tweetController.postReply)

module.exports = router