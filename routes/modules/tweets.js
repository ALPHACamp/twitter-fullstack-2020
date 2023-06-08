const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// 新增一則 tweet
router.post('/', tweetController.postTweets)

// 首頁 取得tweets
router.get('/', tweetController.getTweets)

module.exports = router
