const express = require('express')
const router = express.Router()

// controllers
const replyController = require('../../../controllers/pages/reply-controller')

router.post('/', replyController.postReply)

module.exports = router
