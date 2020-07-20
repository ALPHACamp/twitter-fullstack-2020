const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController.js')


router.get('/', (req, res) => res.redirect('/tweets'))

router.get('/tweets', tweetController.getTweets)

router.get('/login', userController.loginPage);


router.get('/admin', (req, res) => res.redirect('/admin/tweets'))

router.get('/admin/tweets', adminController.getTweets)

module.exports = router;
