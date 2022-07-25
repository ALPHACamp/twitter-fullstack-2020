const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/:id/replies', tweetController.getTweetReplies)
router.post('/:id/replies', tweetController.postTweetReply)
router.post('/:id/like', tweetController.likeTweet)
router.delete('/:id/like', tweetController.unlikeTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
