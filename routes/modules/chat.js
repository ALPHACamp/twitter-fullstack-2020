const express = require('express')
const router = express.Router()
const chatController = require('../../controllers/chat-controller')

router.get('/', chatController.startChatting)
module.exports = router
