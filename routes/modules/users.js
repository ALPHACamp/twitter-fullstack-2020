const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id/tweets', userController.getUser)
router.get('/:id/replies', userController.getUser)
router.get('/:id/likes', userController.getUser)
router.get('/:id/followings', userController.getUserFollowship)
router.get('/:id/followers', userController.getUserFollowship)
router.get('/:id/setting', userController.editUserSetting)
router.put('/:id/setting', userController.putUserSetting)
router.get('/:id', userController.getUser)

module.exports = router
