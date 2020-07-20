const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tweetController = require('../controllers/tweetController')



router.get('/', (req, res) => res.redirect('/tweets'))

router.get('/tweets', tweetController.getweets)

router.get('/login', userController.loginPage);

module.exports = router;
