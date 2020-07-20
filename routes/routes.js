const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.loginPage);

module.exports = router;
