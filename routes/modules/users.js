const express = require('express');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'temp/' });
const passport = require('../../config/passport');

const { authenticated, authenticatedNonAdmin } = require('../../middleware/authenticationHelper');

const usersController = require('../../controllers/usersController');

router.get('/signup', usersController.registerPage);
router.post('/signup', usersController.register);

router.get('/signin', usersController.loginPage);
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticatedNonAdmin, usersController.login);
router.get('/logout', usersController.logout);

router.get('/users/:id/edit', authenticated, usersController.getAccount);
router.put('/users/:id/edit', authenticated, usersController.putAccount);

// 使用者個人推文清單
router.get('/users/:userId/tweets', authenticated, usersController.getTweetsPage);
// 使用者個人推文及回覆清單
router.get('/users/:userId/tweetsReplies', authenticated, usersController.getTweetsRepliesPage);
// 使用者喜歡的內容清單
router.get('/users/:userId/likes', authenticated, usersController.getLikesPage);
// 使用者的追蹤清單
router.get('/users/:userId/followings', authenticated, usersController.getFollowingsPage);
// 使用者的被追蹤清單
router.get('/users/:userId/followers', authenticated, usersController.getFollowersPage);
// 使用者的通知清單
router.get('/users/notification', authenticated, usersController.getNotificationPage);

router.post('/users/:id', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.putUser);

router.get('/', (req, res) => res.redirect('/tweets'));
module.exports = router;
