const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')

router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
router.get('/tweets/:id', tweetController.getTweet)
router.post('tweets/:id/replies', tweetController.postReply)
//user api
router.get('/user', userController.getUser )
router.get('/top10', userController.getTop10)

module.exports = router