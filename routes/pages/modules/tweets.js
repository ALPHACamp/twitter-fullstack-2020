const express = require('express')
const router = express.Router()

// controllers
const tweetController = require('../../../controllers/pages/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)
router.get('/:id/replies', tweetController.getTweet)

module.exports = router