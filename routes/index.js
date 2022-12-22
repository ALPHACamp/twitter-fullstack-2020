const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')


// 載入controller
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')
const replyController = require('../controller/reply-controller')
const apiController = require('../controller/api-controller')



// const upload = require('../middleware/multer')

router.use('/admin', admin)
//signin, logout
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//users
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/followings', userController.getUserFollowing)
router.get('/users/:id/followers', userController.getUserFollower)

router.get('/api/users/:id', apiController.getUserAPI)
router.post('/api/users/:id', apiController.postUserAPI)

// router.get('/api/users/:id', userController.getUserAPI)
// router.post('/api/users/:id', userController.postUserAPI)

//使用者帳戶資訊，驗證不要忘記阻擋非user
router.get('/users/:id/edit', userController.getSetting)
router.put('/users/:id', userController.putSetting)

//reply
router.get('/tweets/:id', authenticated, replyController.getReplies)

//tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

//followship
router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:id', authenticated, userController.removeFollowing)

//like
router.post('/tweets/:id/unlike', tweetController.removeLike)
router.post('/tweets/:id/like', tweetController.addLike)

//fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
