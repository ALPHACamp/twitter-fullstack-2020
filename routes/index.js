const express = require('express')
const router = express.Router()

const tweetController = require('../controller/tweet-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/tweets', tweetController.getTweets)

router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
