const express = require('express')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const authenticated = require('../middleware/auth').authenticated
const router = express.Router()
router.use(authenticated)
router.get('/', tweetController.getTweet)
router.post('/', tweetController.postTweet)
router.get('/:id/replies', tweetController.getReply)
router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)
module.exports = router