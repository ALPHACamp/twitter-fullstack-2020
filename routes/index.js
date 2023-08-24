const express = require('express')
const router = express.Router()
// 引入Modules
const tweetController = require('../controllers/tweet-controller')
// 使用Modules
router.get('/tweets', tweetController.getTweets)

router.get('/', (req, res) => res.redirect('/tweets'))

module.exports = router