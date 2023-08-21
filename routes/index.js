const express = require('express')
const tweetsController = require('../controllers/tweets-controller')
const router = express.Router()


router.get('/tweets', (req, res) => {
  res.render('tweets')
})

router.post('/tweets', tweetsController.postTweet )

module.exports = router