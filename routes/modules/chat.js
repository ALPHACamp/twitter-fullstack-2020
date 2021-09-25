const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const chatController = require('../../controllers/chatController')

router.get('/' , authenticated, chatController.getChat)



module.exports = router
