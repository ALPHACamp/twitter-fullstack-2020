const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:uid/tweets', userController.getUserTweets)

module.exports = router