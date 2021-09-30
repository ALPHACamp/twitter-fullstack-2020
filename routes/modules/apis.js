const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const router = express.Router();
const usersController = require('../../controllers/api/usersController.js');
const { authenticated } = require('../../middleware/authenticationHelper');


router.get('/users/:id', authenticated, usersController.getUser);
router.post('/users/:id', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.putUser);

// reply
// router.get('/tweets/:tweetId', authenticated, tweetsController.getReplyPage);

module.exports = router;