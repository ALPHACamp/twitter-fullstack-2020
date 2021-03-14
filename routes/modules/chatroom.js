const express = require('express');

const router = express.Router();

const chatsController = require('../../controllers/chatsController');

router.get('/public/', chatsController.getPublicChatPage);

router.get('/private/', chatsController.getPrivateChatPage);
router.get('/private/:receiverId', chatsController.getPrivateChatPage);

module.exports = router;
