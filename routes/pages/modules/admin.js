const express = require('express')
const router = express.Router()

// controllers
const adminController = require('../../../controllers/pages/admin-controller')

// middleware
const { adminAuthenticated } = require('../../../middleware/auth')

// admin tweets
router.get('/tweets', adminAuthenticated, adminController.getTweets)
router.delete('/tweets/:id', adminAuthenticated, adminController.deleteTweet)

// admin users
router.get('/users', adminAuthenticated, adminController.getUsers)

module.exports = router
