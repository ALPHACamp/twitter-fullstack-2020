const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const adminController = require('../controllers/admin-controller')
const passport = require('../config/passport')
const helpers = require('../_helpers')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, adminAuthenticated } = require('../middleware/auth')
const followUser = require('../middleware/followUser')

const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const imgUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
])

router.get('/admin/signin', adminController.getSigninPage);
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin);
router.get('/admin/users', adminAuthenticated, adminController.getUsers)
router.delete('/admin/tweets/:tweetId', adminAuthenticated, adminController.deleteTweet)
router.get('/admin/tweets', adminAuthenticated, adminController.getTweets)

router.get('/signup', userController.registerPage)
router.post('/signup', userController.signup)

router.get('/signin', userController.loginPage)
router.post('/signin', passport.authenticate('local', { successRedirect: '/tweets', failureRedirect: '/signin' }))

router.get('/logout', userController.signout)
router.use(followUser.topUsers);
router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/:id/replies', authenticated, userController.getReplies)
router.get('/users/:id/likes', authenticated, userController.getLikes)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id', authenticated, userController.getUser)

router.get('/api/users/:id', authenticated, userController.editProfile)
router.post('/api/users/:id', authenticated, imgUpload, userController.putProfile)

router.get('/edit', authenticated, userController.settingPage)
router.patch('/edit', authenticated, userController.edit)

router.post('/followships', authenticated, userController.addFollow)
router.delete('/followships/:id', authenticated, userController.removeFollow)

router.get('/tweets/:id/replies', authenticated, tweetController.getReplies)
router.get('/tweets/:id', authenticated, tweetController.getReplies);
router.post('/tweets/:id/replies', authenticated, tweetController.postReply)
router.post('/tweets/:id/like', authenticated, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.get('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
