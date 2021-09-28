const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const tweetController = require('../controllers/api/tweetController.js')
const userController = require('../controllers/api/userController.js')

const authenticated = passport.authenticate('jwt', { session: false })

// 首頁

router.get('/', authenticated, (req, res) => res.redirect('/api/tweets'))
router.get('/tweets', authenticated, tweetController.getTweets)

// Follow
router.post('/followships/:id', authenticated, userController.addFollowing)

// 使用者新增推文
router.post('/tweets', authenticated, tweetController.postTweets)

// 取得特定使用者的推文
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)

// Profile - Edit
router.get('/users/:id', authenticated, userController.renderUserProfileEdit)
router.post('/users/:id', authenticated, userController.putUserProfileEdit)

// JWT signin
router.post('/signin', userController.signIn)

module.exports = router