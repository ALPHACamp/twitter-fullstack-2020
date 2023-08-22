const express = require('express')
const passport = require('../config/passport')
const tweetsController = require('../controllers/tweets-controller')
const userController = require('../controllers/user-controller')
const router = express.Router()


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

module.exports = router;