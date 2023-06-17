const express = require('express')
const router = express.Router()
const tweetsController = require('../../controllers/tweets-controller')
const userController = require('../../controllers/user-controller')

const { authenticated } = require('../../middleware/auth')
const { getTopFollowedUsers } = require('../../middleware/general-data')

// tweets
router.use('/', authenticated)
router.get('/:tweetId/replies', getTopFollowedUsers, tweetsController.getTweet)
router.post('/:tweetId/replies', tweetsController.postReply)
router.post('/:tweetId/like', userController.postLike)
router.post('/:tweetId/unlike', userController.postUnlike)
router.get('/', getTopFollowedUsers, tweetsController.getTweets)
router.post('/', tweetsController.postTweet)

module.exports = router
