const express = require('express')
const tweetController = require('../controllers/tweetController')
const authenticated = require('../middleware/auth').authenticated
const userauthenticated = require('../middleware/auth').userauthenticated
const router = express.Router()
router.use(authenticated)
router.get('/', userauthenticated, tweetController.getTweet)
router.post('/', userauthenticated, tweetController.postTweet)
router.get('/:id/replies', userauthenticated, tweetController.getReply)
router.post('/:id/replies', userauthenticated, tweetController.postReply)
router.post('/:id/like', userauthenticated, tweetController.addLike)
router.post('/:id/unlike', userauthenticated, tweetController.removeLike)
module.exports = router