const express = require('express')
const router = express.Router()
// 引入Modules
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

// 使用Modules
router.get('/', tweetController.getTweets)


router.get('/', (req, res) => {
  res.render('following')
})
module.exports = router