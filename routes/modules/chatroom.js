const express = require('express');

const router = express.Router();

const chatsController = require('../../controllers/chatsController');

router.get('/chatroom', chatsController.chatRoomPage);

module.exports = router;
