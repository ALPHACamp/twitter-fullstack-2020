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

// 使用者個人推文清單
router.get('/user/self/', authenticated, usersController.getSelfTweets);
// 使用者個人推文及回覆清單
router.get('/user/self/tweetsReplies/', authenticated, usersController.getSelfTweetsReplies);
// 使用者喜歡的內容清單
router.get('/user/self/like/', authenticated, usersController.getSelfLikes);

module.exports = router;
