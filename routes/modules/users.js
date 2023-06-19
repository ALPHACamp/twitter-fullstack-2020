const express = require('express')
const router = express.Router()
const profileController = require('../../controllers/profile-controller')
const cpUpload = require('../../middleware/multer')

const { authenticated } = require('../../middleware/auth')
const { getUser, getTopFollowedUsers } = require('../../middleware/general-data')

// users
router.use('/', authenticated)
router.get('/:userId/tweets', getTopFollowedUsers, getUser, profileController.getUserTweets)
router.get('/:userId/replies', getTopFollowedUsers, profileController.getUserReplies)
router.get('/:userId/likes', getTopFollowedUsers, profileController.getUserLikes)
router.get('/:userId/followings', getTopFollowedUsers, profileController.getUserFollowings)
router.get('/:userId/followers', getTopFollowedUsers, profileController.getUserFollowers)
router.get('/:userId', getTopFollowedUsers, profileController.editUserAccount)
router.put('/:userId', cpUpload, profileController.putUserAccount)

module.exports = router
