const express = require('express');

const router = express.Router();

const followshipController = require('../../controllers/followshipController');

router.post('/', followshipController.addFollowship);
router.post('/:id', followshipController.addFollowship);
router.delete('/:id', followshipController.removeFollowship);

module.exports = router;
