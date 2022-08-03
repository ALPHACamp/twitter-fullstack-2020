const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')

router.get('/:uid/replies', userController.getReplies)
router.get('/:uid/likes', userController.getLikes)
router.get('/:uid/followings', userController.getFollowings)
router.get('/:uid/followers', userController.getFollowers)
router.get('/:uid/tweets', userController.getTweets)
router.get('/:uid/setting', userController.getUserSetting)
router.get('/:uid', userController.getTweets)

router.use('/', tweetController.getTweets)

module.exports = router
