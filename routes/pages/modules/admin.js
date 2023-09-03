const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/pages/admin-controller')

router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:tweetId', adminController.deleteTweet)
router.get('/users', adminController.getUsers)

module.exports = router
