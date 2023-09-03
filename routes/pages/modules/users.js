const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/pages/user-controller')
const upload = require('../../../middleware/multer')

router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)
router.get('/users/:id/setting', userController.getUserSetting)
router.put('/users/:id/setting', userController.putUserSetting)
router.get('/users/:id/followings', userController.getUserFollowings)
router.get('/users/:id/followers', userController.getUserFollowers)
router.get('/users/:id/tweets', userController.getUserTweets)
router.get('/users/:id/replies', userController.getUserReplies)
router.get('/users/:id/likes', userController.getUserLikes)
router.put('/users/:id/edit', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUserProfile)

module.exports = router

