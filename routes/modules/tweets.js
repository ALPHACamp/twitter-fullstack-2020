const express = require('express');

const router = express.Router();

const tweetsController = require('../../controllers/tweetsController');

/* GET home page. */
router.get('/', tweetsController.getIndexPage);
router.post('/', tweetsController.createTweet);

module.exports = router;
