const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const upload = require('../middleware/multer')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const followshipController = require('../controllers/followship-controller')
const apiController = require('../controllers/apis/user-controller')

const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', authenticated, userController.logout)
router.get('/settings', authenticated, userController.getSetting)
router.put('/settings', authenticated, userController.putSetting)

router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)

router.post('/tweets/:id/like', authenticated, tweetController.postLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.postUnlike)
router.post('/tweets/:id/replies', authenticated, tweetController.postReply)
router.get('/tweets/:id/replies', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getIndex)
router.post('/tweets', authenticated, tweetController.postTweet)

router.delete('/followships/:id', authenticated, followshipController.deleteFollowships)
router.post('/followships/', authenticated, followshipController.postFollowships)

router.get('/api/users/:id', apiController.getUserInfo)
router.post('/api/users/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), authenticated, apiController.postUserInfo)

router.get('/', (req, res) => res.redirect('/signin'))

router.use('/', generalErrorHandler)

module.exports = router
