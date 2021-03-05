const express = require('express');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'temp/' });
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
// router.get('/user/self/', authenticated, usersController.getSelfTweets);
// 使用者個人推文及回覆清單
router.get('/user/self/tweetsReplies/', authenticated, usersController.getSelfTweetsReplies);
// 使用者喜歡的內容清單
router.get('/user/self/like/', authenticated, usersController.getSelfLikes);

// 這段先暫用 .getUser 等 user/self/like 網頁整合為 user/self 後就可將這個路徑和 getuser() 刪除
router.get('/user/self', authenticated, usersController.getUser);

router.put('/user/self/edit', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.putUser);
module.exports = router;
