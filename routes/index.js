const express = require('express')
const passport = require('../config/passport')
const tweetsController = require('../controllers/tweets-controller')
const userController = require('../controllers/user-controller')
const replyController = require('../controllers/reply-controller')
const likesController = require('../controllers/likes-controller')
const router = express.Router()
const upload = require('../middleware/multer')


const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)
router.get('/signin', userController.signinPage)
// router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), usersController.sigin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.sigin)
router.get('/logout', userController.logout)

router.get("/tweets",authenticated, tweetsController.getTweets);
router.post("/tweets",authenticated, tweetsController.postTweet);
router.get('/tweets/:tweetId',authenticated, tweetsController.getTweet)
router.post("/users/:followingUserId/follow",authenticated, userController.postFollow);
router.delete('/users/:followingUserId/follow', authenticated, userController.deleteFollow)
router.post('/tweets/:tweetId/like', authenticated, tweetsController.addLike)
router.delete('/tweets/:tweetId/like', authenticated, tweetsController.deleteLike)
router.post('/tweets/:tweetId/reply', authenticated, tweetsController.postReply)
router.get('/users/:id/tweets', userController.getUser)
router.get('/users/:id/replies', replyController.getReplies)
router.get('/users/:id/likes', likesController.getLikes)
router.get('/users/:id/followers', userController.getFollower) 
router.get('/users/:id/followings', userController.getFollowing) 
router.put('/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),userController.putUser)
router.get('/settings', (req, res) => {
  res.render('settings')
})
module.exports = router;
