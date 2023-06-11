const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')

router.get('/:tid/replies', replyController.getReplies)
router.post('/:tid/replies', replyController.postReplies)
router.post('/:tid/like', tweetController.likeTweet)
router.post('/:tid/unlike', tweetController.unlikeTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router