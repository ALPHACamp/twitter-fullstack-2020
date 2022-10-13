const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')
router.get('/:id/setting', userController.getSetting)
router.put('/:id/setting', userController.putSetting)

router.get('/:id/tweets', userController.tweets)
router.get('/:id/replies', userController.replies)
router.get('/:id/likes', userController.likes)

router.get('/:id/followers', userController.followers)
router.get('/:id/followings', userController.followings)

module.exports = router
