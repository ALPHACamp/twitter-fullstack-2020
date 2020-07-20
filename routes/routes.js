const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tweetController = require('../controllers/tweetController')




router.get('/', tweetController.getweets)

router.get('/login', userController.loginPage);

module.exports = router;
