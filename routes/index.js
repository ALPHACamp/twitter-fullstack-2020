const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
router.get('/signin', userController.login_page)
router.get('/tweets', tweetController.getTweets)
module.exports = router