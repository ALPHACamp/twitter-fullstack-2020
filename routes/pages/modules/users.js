const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/pages/user-controller')

router.get('/:id/tweets', userController.getTweets)
router.get('/:id/setting', userController.getSetting)

module.exports = router
