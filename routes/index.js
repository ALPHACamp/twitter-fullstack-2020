/* Use Express Router */
const express = require('express');

const router = express.Router();

const sessions = require('./modules/sessions');
const tweets = require('./modules/tweets');
router.use('/', tweets);
router.use('/', sessions);

// 匯出路由器
module.exports = router;
