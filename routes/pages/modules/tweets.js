const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/pages/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.post('/:tweetId/like', tweetController.addLike)
router.post('/:tweetId/unlike', tweetController.removeLike)
router.get('/:tweetId/replies', tweetController.getReplies)
router.post('/:tweetId/replies', tweetController.postReply)

module.exports = router
