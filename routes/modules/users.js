const express = require('express')
const router = express.Router()
const profileController = require('../../controllers/profile-controller')
const followshipController = require('../../controllers/followship-controller')
const upload = require('../../middleware/multer')
const { authenticated } = require('../../middleware/auth')

// users
router.use('/', authenticated)
router.get(
  '/:userId/tweets',
  followshipController.getTopFollowedUsers,
  profileController.getUser,
  profileController.getUserTweets
)
router.get('/:userId/replies', followshipController.getTopFollowedUsers, profileController.getUserReplies)
router.get('/:userId/likes', followshipController.getTopFollowedUsers, profileController.getUserLikes)
router.get('/:userId/followings', followshipController.getTopFollowedUsers, profileController.getUserFollowings)
router.get('/:userId/followers', followshipController.getTopFollowedUsers, profileController.getUserFollowers)
router.get('/:userId', followshipController.getTopFollowedUsers, profileController.editUserAccount)
router.put(
  '/:userId',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  profileController.putUserAccount
)

module.exports = router
