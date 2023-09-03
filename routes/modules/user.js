const express = require('express')
const router = express.Router()

const { userController } = require('../../controllers/pages/user-controller')
const verifyUnloadQuery = require('../../middlewares/verifyUnloadQuery')
const cpUpload = require('../../middlewares/multer')

router.get('/:id/likesUnload', verifyUnloadQuery, userController.getLikeTweetsUnload)
router.get('/:id/likes', userController.getLikeTweets)
router.get('/:id/tweetsUnload', verifyUnloadQuery, userController.getUserTweetsUnload)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/repliesUnload', verifyUnloadQuery, userController.getUserRepliesUnload)
router.get('/:id/replies', userController.getUserReplies)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)

router.get('/:id', userController.getUserEditPage)
router.post('/:id', cpUpload, userController.postUserInfo)

module.exports = router
