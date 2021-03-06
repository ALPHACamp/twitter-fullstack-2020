const express = require('express');

const router = express.Router();

const tweetsController = require('../../controllers/tweetsController');

/* GET reply page. */
router.get('/:tweetId', tweetsController.getReplyPage);

/* GET home page. */
router.get('/', tweetsController.getIndexPage);
router.post('/', tweetsController.createTweet);


module.exports = router;
