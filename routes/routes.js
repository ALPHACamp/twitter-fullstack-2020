const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tweetController = require('../controllers/tweetController');
const adminController = require('../controllers/adminController.js');

router.get('/', (req, res) => res.redirect('/tweets'));

router.get('/tweets', tweetController.getTweets);
router.get('/tweets/:id', tweetController.getTweet);
router.get('/admin/login', adminController.adminLoginPage);
router.get('/login', userController.loginPage);
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signup);
router.get('/admin', (req, res) => res.redirect('/admin/tweets'));

router.get('/admin/tweets', adminController.getTweets);

router.delete('/admin/tweets/:id', adminController.deleteTweet);

module.exports = router;
