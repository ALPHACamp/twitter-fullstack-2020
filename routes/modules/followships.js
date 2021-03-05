const express = require('express');

const router = express.Router();

const followshipController = require('../../controllers/followshipController');

router.post('/:userId', followshipController.addFollowship);
router.delete('/:userId', followshipController.removeFollowship);


module.exports = router;