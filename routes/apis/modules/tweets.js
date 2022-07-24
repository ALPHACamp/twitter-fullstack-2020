const express = require('express')
const router = express.Router()

const tweetController = require('../../../controllers/apis/tweet-controller')

router.get('/:id/replies', tweetController.getTweetReplies)
router.post('/:id/replies', tweetController.postTweetReply)
router.post('/:id/like', tweetController.postTweetLike)
router.delete('/:id/like', tweetController.postTweetsUnlike)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
