const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/pages/tweet-controller')
router.get('/:id/replies', tweetController.getReplies)
router.post('/:id/like', tweetController.postLike)
router.post('/:id/unlike', tweetController.postUnlike)
router.post('/', tweetController.postTweets)
router.get('/', tweetController.getTweets)
module.exports = router
