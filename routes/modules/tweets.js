const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// 取得特定推文的回覆頁面
router.get('/:id/replies', tweetController.getTweet)

// 新增一則 tweet
router.post('/', tweetController.postTweets)

// 首頁 取得tweets
router.get('/', tweetController.getTweets)

module.exports = router
