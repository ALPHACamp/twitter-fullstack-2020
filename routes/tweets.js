const router = require('express').Router()
const tweetsController = require('../controllers/tweetsController')

router.get('/', tweetsController.allTweets)

router.get('/:id/top10', tweetsController.getTop10Twitters)

router.get('/:id/replies', tweetsController.getTweetReplies)

router.post('/', tweetsController.postTweet)

router.post('/:id/like', tweetsController.postLike)

router.post('/:id/unlike', tweetsController.postUnlike)

router.post('/:id/replies', tweetsController.postTweetReply)

module.exports = router