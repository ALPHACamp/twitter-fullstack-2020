const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:id/tweets', userController.getTweets)

module.exports = router
