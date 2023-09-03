const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/pages/user-controller')

router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)

module.exports = router
