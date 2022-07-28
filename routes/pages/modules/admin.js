const router = require('express').Router()
const adminController = require('../../../controllers/pages/admin-controller')

router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:tweetId', adminController.deleteTweet)

module.exports = router
