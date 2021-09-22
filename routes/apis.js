const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const tweetController = require('../controllers/api/tweetController.js')
const userController = require('../controllers/api/userController.js')

// //使用者新增一則貼文
router.post('/tweets', tweetController.postTweets)

// //使用者顯示特定使用者頁面(使用者所有貼文)
router.get('/users/:user_id/tweets', userController.getUserTweets)

//render edit page (modal)
router.get('/users/:user_id', userController.renderUserEdit)

//update edit page (modal)
router.post('/users/:user_id', userController.putUserEdit)

module.exports = router