const express = require('express')
const router = express.Router()

const apiController = require('../../controllers/api-controller')

// router.get('/users/:id/tweets', userController.getUserTweets)
router.get('/users/:id', apiController.getUserProfile)
router.post('/users/:id', apiController.postUserProfile)

module.exports = router
