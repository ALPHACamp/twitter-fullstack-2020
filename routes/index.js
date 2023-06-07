const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweet-controller')
const adminController = require('../controllers/admin-controller')

const { authenticator } = require('../middleware/auth')

router.get('/admin/users', adminController.getUsers)
router.get('/admin/tweets', adminController.getTweets)
router.get('/', tweetController.getTweets)

module.exports = router
