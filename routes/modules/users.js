const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')

const userController = require('../../controllers/userController')

//users setting
router.get('/:userId/setting', authenticated, userController.getSetting)
router.put('/:userId/setting', authenticated, userController.editSetting)

//users follow
router.get('/:userId/followings',authenticated,userController.getFollowings)
router.get('/:userId/followers',authenticated,userController.getFollowers)

//users pages
router.get('/:userId/tweets', authenticated, userController.getUserTweets)
router.get('/:userId/replies', authenticated, userController.getReplies)
router.get('/:userId/likes', authenticated, userController.getLikes)



module.exports = router
