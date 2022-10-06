const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signinPage)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)

module.exports = router
