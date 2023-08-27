const express = require('express')
const router = express.Router()
const { adminAuthenticated } = require('../../../middleware/auth')
const adminController = require('../../../controllers/pages/admin-controller')

router.get('/tweets', adminAuthenticated, adminController.getTweets)
router.delete('/tweets/:id', adminAuthenticated, adminController.deleteTweet)
router.get('/users', adminAuthenticated, adminController.getUsers)

module.exports = router
