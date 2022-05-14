const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')
router.post('/:id/like', likeController.likeTweet)
router.post('/:id/unlike', likeController.unlikeTweet)
router.post('/:id/replies', replyController.postReply)
router.get('/:id/replies', replyController.getReplies)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
