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
router.get("/tweets", tweetsController.getTweets);
router.post("/tweets", tweetsController.postTweet);
router.post("/users/:followingUserId/follow", userController.postFollow);
router.get('/users/:id/tweets', userController.getUser)
router.get('/users/:id/replies', replyController.getReplies)
router.get('/users/:id/likes', likesController.getLikes)
router.get('/users/:id/followers', userController.getFollower) 
router.get('/users/:id/followings', userController.getFollowing) 
router.put('/users/:id', userController.putUser)
router.get('/settings', (req, res) => {
  res.render('settings')
})
module.exports = router;
