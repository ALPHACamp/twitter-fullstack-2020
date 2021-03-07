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
router.get('/users/:id/tweets', authenticated, usersController.getSelfTweets);
// 使用者個人推文及回覆清單
router.get('/user/self/tweetsReplies/', authenticated, usersController.getSelfTweetsReplies);
// 使用者喜歡的內容清單
router.get('/users/:id/likes', authenticated, usersController.getSelfLikes);

router.put('/user/self/edit', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.putUser);

router.get('/', (req, res) => res.redirect('/tweets'));
module.exports = router;
