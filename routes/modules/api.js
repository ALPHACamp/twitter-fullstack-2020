const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/users/:id/tweets', userController.getUserTweets)
router.get('/users/:id', userController.getUserProfile)
router.post('/users/:id', userController.postUserProfile)

module.exports = router
