const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const tweetController = require('../controllers/api/tweetController.js')
// const userController = require('../controllers/api/userController.js')

 // //使用者新增一則貼文
 router.post('/tweets', tweetController.postTweets)

 module.exports = router