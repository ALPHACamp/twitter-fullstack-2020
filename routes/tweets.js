const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)
router.get('/:id/replies', tweetController.getReply)
router.post('/:id/replies', tweetController.postReply)
router.post('/:id/like', tweetController.likeTweet)
router.post('/:id/unlike', tweetController.unlikeTweet)

module.exports = router