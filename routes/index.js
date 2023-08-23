const express = require('express')
const router = express.Router()
// 引入Controller
const userController = require('../controllers/user-controller')

// 引入Modules
const tweetController = require('../controllers/tweet-controller')
// 使用Modules
router.get('/', tweetController.getTweets)


module.exports = router