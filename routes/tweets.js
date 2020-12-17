const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')

router.get('/', tweetController.getTweets)
router.get('/:id', tweetController.getTweet)
router.post('/', tweetController.postTweets)
router.post('/:id/replies', tweetController.postReply)
router.get('/:id/like', tweetController.likeTweet)
router.get('/:id/unlike', tweetController.unlikeTweet)

module.exports = router