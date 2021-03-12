const express = require('express');

const router = express.Router();

const chatsController = require('../../controllers/chatsController');

router.get('/public/', chatsController.getPublicChatPage);

module.exports = router;
