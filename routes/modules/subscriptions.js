const express = require('express');

const router = express.Router();

const subscriptionController = require('../../controllers/subscriptionController');

router.post('/:id', subscriptionController.subscribe);
router.delete('/:id', subscriptionController.unsubscribe);

module.exports = router;
