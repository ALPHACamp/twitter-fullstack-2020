const express = require('express')
const router = express.Router()
const replyController = require('../../../controllers/pages/reply-controller')

router.post('/', replyController.postReply)

module.exports = router
