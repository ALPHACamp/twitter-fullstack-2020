const express = require('express');

const router = express.Router();

const tweetsController = require('../../controllers/tweetsController');
const likesController = require('../../controllers/likesController');

/* GET reply page. */
router.get('/:tweetId/replies', tweetsController.getReplyPage);
router.post('/:tweetId/replies', tweetsController.creatReply);

/* GET home page. */
router.get('/', tweetsController.getIndexPage);
router.post('/', tweetsController.createTweet);

/* GET reply page. */
router.get('/:tweetId', tweetsController.getReplyPage);

router.post('/:tweetId/like', likesController.addLike);
router.post('/:tweetId/unlike', likesController.removeLike);
router.delete('/:tweetId/unlike', likesController.removeLike);

module.exports = router;
