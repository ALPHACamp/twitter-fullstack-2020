const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin
//admin/tweets
router.get('/tweets', authenticatedAdmin, adminController.getTweet)


module.exports = router