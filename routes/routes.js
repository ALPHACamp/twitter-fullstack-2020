const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const tweetController = require('../controllers/tweetController');
const settingValidator = require('../middleware/validator').settingValidator

const authenticated = require('./authMiddleware').authenticated;
const authenticatedAdmin = require('./authMiddleware').authenticatedAdmin;

const helpers = require('../_helpers');
const passport = require('../config/passport');

router.get('/', authenticated, (req, res) => res.redirect('/tweets'));

router.get('/tweets', authenticated, tweetController.getTweets);
router.post('/tweets', authenticated, tweetController.postTweet);
router.get('/tweets/:id/replies', authenticated, tweetController.getTweet);
router.post('/tweets/:id/replies', authenticated, tweetController.postReply)

router.post('/tweets/:tweetId/like', authenticated, userController.addLike);
router.post('/tweets/:tweetId/unlike', authenticated, userController.removeLike);

router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);

router.get('/signin', userController.signInPage);
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn);

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'));
router.get('/admin/users', authenticatedAdmin, adminController.getAllUsers);
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet);

router.get('/admin/signin', adminController.signInPage);
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn);
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets);

router.get('/signout', userController.signOut);
router.get('/admin/signout', adminController.signOut);

router.get('/users/:id', authenticated, userController.userPage)
router.get('/users/:id/setting', authenticated, userController.getUserSetting)
router.put('/users/:id/setting', authenticated, settingValidator, userController.putUserSetting)
router.get('/users/:id/replies', authenticated, userController.userPageReplies)
router.get('/users/:id/likes', authenticated, userController.userPageLikes)
router.put('/users/:id', authenticated, upload.fields([
  { name: 'avatarImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), userController.putProfile)
router.get('/users/:id/followers', authenticated, userController.userFollowersPage)
router.get('/users/:id/followings', authenticated, userController.userFollowingsPage)
router.post('/following/:id', authenticated, userController.getFollowing)
router.delete('/following/:id', authenticated, userController.deleteFollowing)

module.exports = router
