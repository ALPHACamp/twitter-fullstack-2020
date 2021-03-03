const express = require('express');

const router = express.Router();

const likesController = require('../../controllers/likesController');

/* GET home page. */
router.post('/:tweetId', likesController.addLike);
router.delete('/:tweetId', likesController.removeLike);

module.exports = router;
