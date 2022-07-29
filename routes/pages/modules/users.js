const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/pages/user-controller')

router.get('/:userId/tweets', userController.getTweets)
router.get('/:userId/replies', userController.getReplies)
router.get('/:userId/likes', userController.getLikes)

module.exports = router
