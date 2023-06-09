const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')
const tweetController = require('../controllers/tweet-controller')

router.use('/admin', admin)

router.get('/tweets/:id/replies', tweetController.getTweet)
router.get('/tweets', tweetController.getTweets) // 顯示全部推文
router.post('/tweets', tweetController.createTweet) // 新增推文

router.get('/', (req, res) => res.render('tweets')) // 專案初始測試路由
router.use('/', generalErrorHandler)

module.exports = router
