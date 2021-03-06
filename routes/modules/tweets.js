const express = require('express');

const router = express.Router();

const tweetsController = require('../../controllers/tweetsController');
const likesController = require('../../controllers/likesController');

/* GET home page. */
router.get('/', tweetsController.getIndexPage);
router.post('/', tweetsController.createTweet);

router.post('/:tweetId/like', likesController.addLike);
router.delete('/:tweetId/unlike', likesController.removeLike);
module.exports = router;
