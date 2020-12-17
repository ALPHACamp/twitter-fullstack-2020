const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')

router.get('/', tweetController.getTweets)
router.post('/:id/replies', tweetController.replyTweet)
router.get('/:id/like', tweetController.likeTweet)

module.exports = router