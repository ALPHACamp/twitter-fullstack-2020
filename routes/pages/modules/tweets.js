const express = require('express')
const router = express.Router()

const tweetController = require('../../../controllers/pages/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.addTweet)
router.post('/:tweetId/like', tweetController.addLike)
router.post('/:tweetId/unlike', tweetController.deleteLike)
router.get('/:tweetId/replies', tweetController.getReplies)

module.exports = router
