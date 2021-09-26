const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const chatController = require('../../controllers/chatController')

router.get('/' , authenticated, chatController.getChat)
router.get('/private', authenticated, chatController.getPrivateChatPage)
router.get('/private/:receiverId', authenticated, chatController.getPrivateChat)



module.exports = router
