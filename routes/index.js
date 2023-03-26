const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/signin', userController.loginPage)
router.get('/signup', userController.registerPage)
router.get('/api/users/:id', userController.settingPage)
router.get('/tweets/id/replies', tweetController.getReplies) //測試畫面用
router.post('tweets/id/replies', tweetController.postReply)
router.post('tweets/id/like', tweetController.addLike)
router.post('tweets/id/unlike', tweetController.removeLike)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
router.get('/users/1/tweets', userController.getUser)
module.exports = router