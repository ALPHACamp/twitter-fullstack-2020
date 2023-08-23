const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweet-controller')

const admin = require('./modules/admin')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
// 上行尚須補authenticated

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
