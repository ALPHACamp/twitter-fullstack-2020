const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

router.get('/signup', userController.signUpPage)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)

router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
