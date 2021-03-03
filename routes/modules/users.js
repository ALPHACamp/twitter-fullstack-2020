const express = require('express');

const router = express.Router();
const passport = require('../../config/passport');

const usersController = require('../../controllers/usersController');

router.get('/regist', usersController.registerPage);
router.post('/regist', usersController.register);

router.get('/login', usersController.loginPage);
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usersController.login);
router.get('/logout', usersController.logout);

router.get('/:id/setting', usersController.getAccount);
router.put('/:id/setting', usersController.putAccount);
module.exports = router;
