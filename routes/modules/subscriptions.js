const express = require('express');

const router = express.Router();

const subscriptionController = require('../../controllers/subscriptionController');

// router.post('/', subscriptionController.addSubscribe);
router.post('/:id', subscriptionController.addSubscribe);
// router.delete('/:id', subscriptionController.removeSubscribe);

module.exports = router;
