const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:id/tweets', userController.getTweets)
router.get('/:id/replies', userController.getReplies)

module.exports = router
