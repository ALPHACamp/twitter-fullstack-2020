const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const upload = require('../middleware/multer')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('user', {
    successRedirect: '/tweets',
    failureRedirect: '/signin'
  }),
  userController.signIn
)
router.get('/logout', userController.logout)

//* 追蹤功能
router.post('/followships', authenticated, userController.addFollowing)
router.delete(
  '/followships/:id',
  authenticated,
  tweetController.getTweetReplies
)
router.post('/tweets', authenticated, tweetController.postTweet)
router.post(
  '/tweets/:id/replies',
  authenticated,
  tweetController.postTweetReply
)
router.post('/tweets/:id/like', authenticated, userController.addLike)
router.delete('/tweets/:id/unlike', authenticated, userController.removeLike)
router.get('/tweets', authenticated, tweetController.getTweets)

router.get('/users/:id/tweets', authenticated, userController.getUser)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/account', authenticated, userController.editUserAccount)
router.put('/users/:id/account', authenticated, userController.putUserAccount)
router.get(
  '/users/:id/followings',
  authenticated,
  userController.getUserFollowing
)
router.get(
  '/users/:id/followers',
  authenticated,
  userController.getUserFollower
)
router.put(
  '/users/:id',
  authenticated,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  userController.putUserInfo
)
router.get('/user', userController.getOther)

router.get('/other-likes', (req, res) => {
  res.render('other-likes')
})
router.get('/self-likes', (req, res) => {
  res.render('self-likes')
})

router.use('/', authenticated, generalErrorHandler)
router.use('/', generalErrorHandler)

module.exports = router
