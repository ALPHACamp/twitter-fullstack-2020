const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/:id', (req, res) => res.render('tweet'))
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
