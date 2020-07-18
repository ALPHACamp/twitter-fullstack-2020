const express = require('express');
const routes = require('.');
const router = express.Router();

router.get('/', (req, res) => res.send('test'));

module.exports = router;
