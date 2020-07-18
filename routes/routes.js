const express = require('express');
const routes = require('.');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

//router.get('/', (req, res) => res.send('test'));
router.get('/admin/login', adminController.adminLoginPage);
router.get('/login', userController.loginPage);
router.get('/signup', userController.signupPage);
router.post('/signup', userController.signup);

module.exports = router;
