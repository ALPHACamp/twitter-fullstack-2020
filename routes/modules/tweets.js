const express = require('express');

const router = express.Router();

const tweetsController = require('../../controllers/tweetsController');

/* GET home page. */
router.get('/', tweetsController.getIndexPage);

module.exports = router;
