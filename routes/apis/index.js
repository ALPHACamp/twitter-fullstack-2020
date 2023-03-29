const express = require('express')
const router = express.Router()
// const passport = require('../../config/passport')
// const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
// const upload = require('../../middleware/multer')
// const { generalErrorHandler } = require('../../middleware/error-handler') // 加


const userController = require('../../controllers/apis/user-controller')
const tweetController = require('../../controllers/apis/tweet-controller')

router.get('/api/users/:id/tweets', userController.getUserTweets)
router.get('/api/users/:id/replies', userController.getUserReplies)
router.get('/api/users/:id/likes', userController.getUserLikes)
router.post('/api/users/:id/follow', userController.addFollowing)
router.delete('/api/users/:id/follow', userController.removeFollowing)
router.get('/api/tweets/:id/like', tweetController.getLikeCount)
router.post('/api/tweets/:id/like', tweetController.addLike)
router.delete('/api/tweets/:id/like', tweetController.removeLike)
router.post('/api/tweets/', tweetController.postTweet)
// router.post('/tweets/:id/replies', tweetController.postReply)

// router.get('/tweets/', tweetController.getTweets)

// router.use('/test', (req, res) => res.render('test'))
// router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
