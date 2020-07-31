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
    if (helpers.getUser(req).role === 'user') {
      res.locals.myUser = helpers.getUser(req);
      return next();
    } else {
      res.redirect('/admin/tweets');
    }
    req.flash('error_messages', 'You are not an user, please login here');
    return res.redirect('/admin/signin');
  }
  req.flash('error_messages', 'Please login first');
  res.redirect('/signin');
};
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      res.locals.myUser = helpers.getUser(req);
      return next();
    }
    req.flash('error_messages', 'You are not an admin, please login here');
    return res.redirect('/signin');
  }
  res.redirect('/signin');
};

router.get('/admin/signin', adminController.adminLoginPage);
router.post('/admin/signin', passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }), adminController.login );
router.get('/admin', (req, res) => res.redirect('/admin/tweets'));
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets);
router.get('/admin/users', authenticatedAdmin, adminController.getUsers);
router.delete('/admin/tweets/:id',authenticatedAdmin, adminController.deleteTweet );

router.get('/', (req, res) => res.redirect('/tweets'));
router.get('/tweets', authenticated, userController.topUserForLayout, tweetController.getTweets );
router.get('/tweets/:id/replies', authenticated, userController.topUserForLayout, (req, res, next) => {
    res.locals.getComment = true;
    return next();
  }, tweetController.getTweet );
router.post('/tweets', authenticated, tweetController.postTweet);
router.get('/tweets/:id', authenticated, userController.topUserForLayout, tweetController.getTweet );

router.get('/logout', userController.logout);
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signup);
router.get('/signin', userController.loginPage);
router.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.login );

router.post('/tweets/:tweetId/like', authenticated, userController.addLike);
router.delete('/tweets/:tweetId/unlike', authenticated, userController.removeLike);
router.post('/replies/likes/:ReplyId', authenticated, userController.addReplyLike );
router.delete('/replies/likes/:ReplyId', authenticated, userController.removeReplyLike );
router.post('/followships', authenticated, userController.addFollowing);
router.delete('/followships/:id', authenticated, userController.removeFollowing );

router.get('/users/:id/profile', authenticated, userController.editProfile);
router.put('/users/:id/profile', authenticated, upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]), userController.putEditProfile );
router.get('/users/:id/comments', authenticated, userController.topUserForLayout, userController.getUserReply );
router.get('/users/:id/tweets', authenticated, userController.topUserForLayout, userController.getUserPage );
router.post('/tweets/:id/replies', authenticated, userController.topUserForLayout, tweetController.postComment );
router.get('/users/:id/likes', authenticated, userController.topUserForLayout, userController.getUserLike );
router.get('/users/:id/edit', authenticated, userController.editUser);
router.put('/users/:id/edit', authenticated, userController.putEditUser);
router.get('/users/:id/followings', authenticated, userController.topUserForLayout, userController.getFollowings );
router.get('/users/:id/followers', authenticated, userController.topUserForLayout, userController.getFollowers );
router.get('/users/:id', authenticated, userController.topUserForLayout, userController.getUserPage );

module.exports = router;
