const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
const passport = require('../config/passport');
const helpers = require('../_helpers');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const tweetController = require('../controllers/tweetController');
const followshipController = require('../controllers/followshipController');

const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const imgUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]); // 同時傳兩張圖片的設定

const adminAuthenticated = (req, res, next) => {
  if (
    helpers.ensureAuthenticated(req) &&
    (helpers.getUser(req).isAdmin || helpers.getUser(req).role)
  )
    return next();
  return res.redirect('/admin/signin');
};

const userAuthenticated = (req, res, next) => {
  if (
    helpers.ensureAuthenticated(req) &&
    !helpers.getUser(req).isAdmin &&
    !helpers.getUser(req).role
  )
    return next();
  if (
    helpers.ensureAuthenticated(req) &&
    (helpers.getUser(req).role || helpers.getUser(req).isAdmin)
  )
    return res.redirect('/admin/tweets');
  return res.redirect('/signin');
};

//////////////////////////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
  res.redirect('/tweets');
});

router.get('/tweets', userAuthenticated, tweetController.getTweets);

router.get('/users/self', userAuthenticated, userController.getSelf);
router.get(
  '/users/:id/setting',
  userAuthenticated,
  userController.getUserSettingPage,
);
router.put(
  '/users/:id/setting',
  userAuthenticated,
  userController.putUserSetting,
);
router.get(
  '/users/:id/followings',
  userAuthenticated,
  userController.getFollowingsPage,
);
router.get(
  '/users/:id/followers',
  userAuthenticated,
  userController.getFollowersPage,
);
router.get('/users/:id', userAuthenticated, userController.getUser);
router.get(
  '/users/:id/tweets',
  userAuthenticated,
  userController.getTweetsPage,
);
router.get('/users/:id/likes', userAuthenticated, userController.getLikesPage);

router.post(
  '/users/:id/edit',
  userAuthenticated,
  imgUpload,
  userController.putUserProfile,
);

router.post('/followships', userAuthenticated, followshipController.addFollow);
router.delete(
  '/followships/:id',
  userAuthenticated,
  followshipController.unFollow,
);

router.get('/signup', userController.getSignupPage);
router.post('/signup', userController.signup);
router.get('/signin', userController.getSigninPage);
router.post(
  '/signin',
  passport.authenticate('local', { failureRedirect: '/signin' }),
  userController.signin,
);

router.get('/admin/tweets', adminAuthenticated, adminController.getTweets);
router.get('/admin/signin', adminController.getSigninPage);
router.post(
  '/admin/signin',
  passport.authenticate('local', { failureRedirect: '/admin/signin' }),
  adminController.signin,
);
router.delete(
  '/admin/tweets/:tweetId',
  adminAuthenticated,
  adminController.deleteTweet,
);

module.exports = router;
