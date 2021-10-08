const router = require('express').Router()
const tweetsController = require('../controllers/tweetsController')

router.get('/', tweetsController.allTweets)

router.get('/:id/top10', tweetsController.getTop10Twitters)

module.exports = router