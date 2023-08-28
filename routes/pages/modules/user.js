const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/pages/user-controller')

router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/followings', userController.getFollowingUsers)
// router.get('/:/followers')
router.get('/:id', userController.getUserEditPage)

module.exports = router
