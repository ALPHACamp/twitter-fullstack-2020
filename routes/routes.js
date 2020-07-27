const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tweetController = require('../controllers/tweetController');
const adminController = require('../controllers/adminController.js');
const helpers = require('../_helpers');
const passport = require('passport');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (req.user.role === 'user') {
      res.locals.myUser = req.user
      return next();
    }
    req.flash('error_messages', 'You are not an user, please login here');
    return res.redirect('/admin/login');
  }
  req.flash('error_messages', 'Please login first');
  res.redirect('/login');
};
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (req.user.role === 'Admin') {
      res.locals.myUser = req.user
      return next();
    }
    req.flash('error_messages', 'You are not an admin, please login here');
    return res.redirect('/login');
  }
  res.redirect('/login');
};

router.get('/', (req, res) => res.redirect('/tweets'));
router.get('/tweets', authenticated, userController.topUserForLayout, tweetController.getTweets);
router.post('/tweets/newTweets', authenticated, tweetController.postTweet);
router.get('/tweets/:id', authenticated, userController.topUserForLayout, tweetController.getTweet);


router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signup);
router.get('/login', userController.loginPage);
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  userController.login
);

router.get('/admin/login', adminController.adminLoginPage);
router.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.login);
router.get('/admin', (req, res) => res.redirect('/admin/tweets'));
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets);
router.get('/admin/users', authenticatedAdmin, adminController.getUsers);
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet);

router.post('/likes/:tweetId', authenticated, userController.addLike);
router.delete('/likes/:tweetId', authenticated, userController.removeLike);
router.post('/replies/likes/:ReplyId', authenticated, userController.addReplyLike)
router.delete('/replies/likes/:ReplyId', authenticated, userController.removeReplyLike)
router.post('/followings/:userId', authenticated, userController.addFollowing);
router.delete('/followings/:userId', authenticated, userController.removeFollowing);

router.get('/users/:id/profile', authenticated, userController.editProfile);
router.put('/users/:id/profile', authenticated, upload.fields([{ name: 'backgroundImg', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putEditProfile);
router.get('/users/:id/comments', authenticated, userController.topUserForLayout, userController.getUserReply)
router.get('/users/:id/tweets', authenticated, userController.topUserForLayout, userController.getUserPage)
router.post('/tweets/:id/comments', authenticated, userController.topUserForLayout, tweetController.postComment)
router.get('/users/:id/likes', authenticated, userController.topUserForLayout, userController.getUserLike)
router.get('/users/:id/edit', authenticated, userController.editUser);
router.put('/users/:id/edit', authenticated, userController.putEditUser);
router.get('/users/:id/followings', authenticated, userController.topUserForLayout, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.topUserForLayout, userController.getFollowers)
router.get('/users/:id', authenticated, userController.topUserForLayout, userController.getUserPage)


module.exports = router;
