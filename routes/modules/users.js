const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:uid/tweets', userController.getUserTweets)
router.get('/:uid/replies', userController.getUserReplies)
router.get('/:uid/likes', userController.getUserLikes)
router.get('/:uid/followings', userController.getUserFollowings)
router.get('/:uid/followers', userController.getUserFollowers)

module.exports = router