/* Use Express Router */
const express = require('express');

const router = express.Router();


const tweets = require('./modules/tweets');
router.use('/', tweets);

// 匯出路由器
module.exports = router;
