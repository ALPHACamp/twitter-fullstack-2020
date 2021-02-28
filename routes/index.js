/* Use Express Router */
const express = require('express');

const router = express.Router();

const users = require('./modules/users');
const tweets = require('./modules/tweets');

router.use('/', tweets);
router.use('/', users);

// 匯出路由器
module.exports = router;
