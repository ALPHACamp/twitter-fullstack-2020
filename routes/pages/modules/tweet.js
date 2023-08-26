const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/pages/tweet-controller')
router.get('/:id/replies', tweetController.getReplies)
router.get('/', tweetController.getTweets)
module.exports = router
