const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')

const tweetController = require('../../controllers/tweetController')

// tweets
router.get('/', authenticated, tweetController.getTweets)

router.get('/:tweetId/replies', authenticated, tweetController.getTweet)
router.post('/', authenticated, tweetController.addTweet)
router.post('/:tweetId/replies',authenticated,tweetController.postReplies)

// tweets like
router.post('/:tweetId/like', authenticated, tweetController.addLike)
router.post('/:tweetId/unlike',authenticated,tweetController.removeLike)


module.exports = router
