const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweet-controller')

router.get('/tweets', tweetController.getTweets)

router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
