const express = require('express')
const router = express.Router()
// const passport = require('../../config/passport')
// const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
// const upload = require('../../middleware/multer')
// const { generalErrorHandler } = require('../../middleware/error-handler') // 加


const userController = require('../../controllers/pages/user-controller')
const tweetController = require('../../controllers/pages/tweet-controller')





router.post('/tweets/:id/like', userController.addLike)
router.delete('/tweets/:id/like', userController.removeLike)

// router.post('/tweets/:id/replies', tweetController.postReply)
router.get('/tweets/:id', tweetController.getTweet)
router.get('/tweets/', tweetController.getTweets)

router.use('/test', (req, res) => res.render('test'))
router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
