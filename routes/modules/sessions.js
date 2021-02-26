const express = require('express');

const router = express.Router();

const sessionsController = require('../../controllers/sessionsController');

router.get('/regist', sessionsController.registerPage);
router.post('/regist', sessionsController.register);

module.exports = router;