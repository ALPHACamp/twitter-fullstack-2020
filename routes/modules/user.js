const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id/tweets', userController.getUser)
router.get('/:id/likes', userController.getLikes)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)

module.exports = router