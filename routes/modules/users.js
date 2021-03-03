const express = require('express');

const router = express.Router();
const passport = require('../../config/passport');

const { authenticated, authenticatedNonAdmin } = require('../../middleware/authenticationHelper');

const usersController = require('../../controllers/usersController');

router.get('/regist', usersController.registerPage);
router.post('/regist', usersController.register);

router.get('/login', usersController.loginPage);
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), authenticatedNonAdmin, usersController.login);
router.get('/logout', usersController.logout);

router.get('/:id/setting', authenticated, usersController.getAccount);
router.put('/:id/setting', authenticated, usersController.putAccount);
module.exports = router;
