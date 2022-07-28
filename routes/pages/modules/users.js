const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/pages/user-controller')

router.get('/:userId/tweets', userController.getTweets)

module.exports = router
