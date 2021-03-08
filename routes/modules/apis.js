const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

const usersController = require('../../controllers/api/usersController.js');
const { authenticated, authenticatedNonAdmin } = require('../../middleware/authenticationHelper');

const router = express.Router();

router.get('/users/:id', authenticated, usersController.getUser);
router.post('/users/:id', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.putUser);

module.exports = router;
