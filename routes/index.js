const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweetController = require('../controllers/tweet-controller')

const admin = require('./modules/admin')
router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)

router.get('/tweets', tweetController.getTweets)

module.exports = router