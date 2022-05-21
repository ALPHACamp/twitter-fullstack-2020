const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')

router.get('/:id/tweets', authenticated, userController.getUser)
router.get('/:id/replies', authenticated, userController.getReplies)
router.get('/:id/likes', authenticated, userController.getLikes)
router.get('/:id/followers', authenticated, userController.getFollowers)
router.get('/:id/followings', authenticated, userController.getFollowings)

module.exports = router