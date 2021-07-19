const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')

router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)
router.get('/tweets/:id', tweetController.getTweet)
router.post('tweets/:id/replies', tweetController.postReply)
//user api
router.get('/users/:id', userController.getUser )
router.get('/top10', userController.getTop10)
router.post('/users/:id', upload.fields([
  { name: 'avatarImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), userController.putProfile)

module.exports = router