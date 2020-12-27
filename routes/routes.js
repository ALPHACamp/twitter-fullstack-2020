const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const twitterController = require('../controllers/twitterController.js')
const chatController = require('../controllers/chatController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const helplers = require('../_helpers')
const { authenticatedUser, authenticatedAdmin, beSigned } = require('../middleware/check-auth')

const passport = require('../config/passport')
const user = require('../models/user.js')

/// ////
// admin
/// ////
router.get('/admin/signin', beSigned, adminController.signinPage)
router.post('/admin/signin', beSigned, passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), authenticatedAdmin, adminController.signin)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

/// ////
// User
/// ////
// router.get('/', (req, res) => res.render('/personChat'))
router.get('/', (req, res) => res.redirect('/signup'))
router.get('/signup', beSigned, userController.signUpPage)
router.post('/signup', beSigned, userController.signUp)
router.get('/signin', beSigned, userController.signInPage)
router.post('/signin', beSigned, passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticatedUser, userController.signIn)
router.get('/logout', userController.logout)

router.get('/user/setting', authenticatedUser, userController.getSetting)
router.put('/user/setting', authenticatedUser, userController.updateSetting)

router.get('/users', authenticatedUser, userController.getUsers)
router.get('/user/:id', authenticatedUser, userController.getUserProfile)
router.post('/user/:id', authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.updateProfile)
router.delete('/user/:id', authenticatedUser, userController.deleteImage)
router.get('/user/followship/:id', authenticatedUser, userController.getUserFollowShip)
router.post('/user/followship/:id', authenticatedUser, userController.postUserFollowShip)
router.delete('/user/followship/:id', authenticatedUser, userController.deleteUserFollowShip)

// for test api followship
router.post('/followships', authenticatedUser, userController.postFollowShips_json)
router.delete('/followships/:id', authenticatedUser, userController.deleteFollowShips_json)

// for test api user
router.get('/users/:id/tweets', authenticatedUser, userController.getUserTweets)
router.get('/users/:id/followings', authenticatedUser, userController.getUserFollowings)
router.get('/users/:id/followers', authenticatedUser, userController.getUserFollowers)
router.get('/users/:id/likes', authenticatedUser, userController.getUserLikes)

/// ////
// tweet
/// ////
router.get('/tweets', authenticatedUser, twitterController.getTwitters)
router.post('/tweets', authenticatedUser, twitterController.createTwitters)
router.post('/tweets/:id/thumbs_up', authenticatedUser, twitterController.postTwitters_thumbs_up)
router.post('/tweets/:id/thumbs_down', authenticatedUser, twitterController.postTwitters_thumbs_down)
router.get('/tweets/:id/replies', authenticatedUser, twitterController.getTwitter)
router.post('/tweets/:id/replies', authenticatedUser, twitterController.postReply)
router.post('/tweets/:id/like', authenticatedUser, twitterController.postTwitters_thumbs_up)
router.post('/tweets/:id/unlike', authenticatedUser, twitterController.postTwitters_unlike)

/// ////
// chat
/// ////
router.get('/globalChat', authenticatedUser, chatController.getGlobalChat)
router.get('/privateChat', authenticatedUser, chatController.getPrivateChat)
router.get('/privateChat/:id', authenticatedUser, chatController.getPrivateChat_with)

module.exports = router
