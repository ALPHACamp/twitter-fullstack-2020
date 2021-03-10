const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

const usersController = require('../../controllers/api/usersController.js');
const tweetsController = require('../../controllers/api/tweetsController')
const { authenticated, authenticatedNonAdmin } = require('../../middleware/authenticationHelper');

const router = express.Router();

router.get('/users/:id', authenticated, usersController.getUser);
router.post('/users/:id', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.putUser);

// reply
router.get('/tweets/:tweetId', authenticated, tweetsController.getReplyPage);

module.exports = router;
