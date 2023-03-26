const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/signin', userController.loginPage)
router.get('/signup', userController.registerPage)
router.get('/api/users/:id', userController.settingPage)
router.get('/tweets/id/replies', replyController.getReplies) //測試畫面用
router.get('/tweets', tweetController.getTweets)
router.get('/users/1/tweets', userController.getUser)
router.get('/users/1/followers', userController.getFollowers)
router.get('/users/1/followings', userController.getFollowings)

module.exports = router