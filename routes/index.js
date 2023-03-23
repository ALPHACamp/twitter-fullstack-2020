const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
router.get('/signin', userController.login_page)
router.get('/tweets/id/replies', replyController.getReplies) //測試畫面用
router.get('/tweets', tweetController.getTweets)
module.exports = router