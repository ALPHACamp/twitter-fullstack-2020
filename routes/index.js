const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const { authenticatedAdmin } = require('../middleware/auth')

// 載入controller
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')
const replyController = require('../controller/reply-controller')
const admin = require('./modules/admin')


// 載入使用者認證 middleware/auth.js
const { authenticated } = require('../middleware/auth')
const { authenticatedAdmin } = require('../middleware/auth')
// error handleler
// router.use('/admin', admin)


//signin, logout
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

// Tweets
// router.post('/tweets', authenticated, tweetController.postTweet)
// router.get('/tweets', tweetController.getTweet)

//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
//followings
// router.get('/users/followings', userController.getFollower)

// router.get('/users/', userController.getUserPage)
//users
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/following', userController.getUserFollowing)
router.get('/users/:id/follower', userController.getUserFollower)

//personal
// router.get('/users/tweets', userController.getPerson)

//使用者帳戶資訊，驗證不要忘記阻擋非user
router.get('/users/:id/edit', userController.getSetting)
router.put('/users/:id', userController.putSetting)

//replies
// router.get('/users/replies', userController.reply)

//reply
router.get('/tweets/:id', authenticated, replyController.getReplies)

//tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)


//fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
// router.use('/', generalErrorHandler)

module.exports = router
