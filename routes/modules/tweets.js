const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)
router.get('/:tweetId/replies', tweetController.getReplies)
router.post('/:tweetId/like', tweetController.likeTweets)
router.post('/:tweetId/unlike', tweetController.unlikeTweets)

module.exports = router
