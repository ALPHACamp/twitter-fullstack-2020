const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin
//admin/tweets
router.use(authenticatedAdmin)
router.get('/', adminController.getTweets)
router.delete('/:id', adminController.deleteTweet)

module.exports = router