const express = require('express')
const router = express.Router()
// 引入Modules
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

// 使用Modules
router.get('/tweets', tweetController.getTweets)

router.get('/users/:id/followers', userController.getUserFollowers)
router.get('/users/:id/followings', userController.getUserFollowings)
router.get('/users/:id/setting', userController.getUserSetting)

// test
router.get('/', (req, res) => {
  res.render('followings')
})

module.exports = router