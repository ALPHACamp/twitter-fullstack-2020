const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')

router.get('/users', adminController.getUsers)
router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweet)
router.post('/signin', adminController.adminSignIn)

module.exports = router
