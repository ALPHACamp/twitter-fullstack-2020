const express = require('express')
const router = express.Router()
const profileController = require('../../controllers/profile-controller')
const cpUpload = require('../../middleware/multer')

const { authenticated } = require('../../middleware/auth')
const { getUser, getTopFollowedUsers } = require('../../middleware/general-data')

// users
router.use('/', authenticated)
router.get('/', getTopFollowedUsers)
router.get('/:userId/tweets', getUser, profileController.getUserTweets)
router.get('/:userId/replies', profileController.getUserReplies)
router.get('/:userId/likes', profileController.getUserLikes)
router.get('/:userId/followings', profileController.getUserFollowings)
router.get('/:userId/followers', profileController.getUserFollowers)
router.get('/:userId', profileController.editUserAccount)
router.put('/:userId', cpUpload, profileController.putUserAccount)

module.exports = router
