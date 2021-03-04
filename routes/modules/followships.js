const express = require('express');

const router = express.Router();

const followshipController = require('../../controllers/followshipContorller');

router.post('/:userId', followshipController.addFollowship);
router.delete('/:userId', followshipController.removeFollowship);


module.exports = router;