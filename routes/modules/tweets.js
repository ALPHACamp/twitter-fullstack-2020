const express = require('express')
const router = express.Router()

const replyController = require('../../controllers/reply-controller')
const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')

router.post('/:id/like', likeController.postLike)
router.post('/:id/unlike', likeController.postUnlike)
router.get('/:tid/replies', replyController.getReply)
router.post('/:tid/replies', replyController.postReply)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

router.use('/', tweetController.getTweets)

module.exports = router
