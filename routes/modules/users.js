const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/setting', userController.getSettingPage)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id', userController.getUserProfile)
router.post('/:id', userController.postUserProfile)

module.exports = router
