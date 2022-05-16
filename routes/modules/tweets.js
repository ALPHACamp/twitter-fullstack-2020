const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const userController = require('../../controllers/user-controller')

router.post('/:id/like', userController.addLike)
router.post('/:id/unlike', userController.removeLike)
router.post('/:id/reply', tweetController.postReply)
router.get('/:id', tweetController.getTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
