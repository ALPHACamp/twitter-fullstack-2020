const express = require('express');

const router = express.Router();
const passport = require('../../config/passport');

const sessionsController = require('../../controllers/sessionsController');

router.get('/regist', sessionsController.registerPage);
router.post('/regist', sessionsController.register);

router.get('/login', sessionsController.loginPage);
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), sessionsController.login);
router.get('/logout', sessionsController.logout);

module.exports = router, passport;