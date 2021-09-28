const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const router = express.Router();
const usersController = require('../../controllers/api/usersController.js');
// const tweetsController = require('../../controllers/api/tweetsController');
// const { authenticated, authenticatedNonAdmin } = require('../../middleware/authenticationHelper');



router.get('/users/:id', usersController.getUser);
router.post('/users/:id',  upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.putUser);

// reply
// router.get('/tweets/:tweetId', authenticated, tweetsController.getReplyPage);

module.exports = router;