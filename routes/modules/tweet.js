const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/pages/tweet-controller')

router.get('/tweetsUnload', tweetController.getTweetsUnload)

router.get('/:id/replies', tweetController.getReplies)
router.get('/:id/repliesUnload', tweetController.getRepliesUnload)
router.post('/:id/replies', tweetController.postReplies)

router.post('/:id/like', tweetController.postLike)
router.post('/:id/unlike', tweetController.postUnlike)

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)

module.exports = router
