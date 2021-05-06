const exrpess = require('express');
const router = exrpess.Router();
const helpers = require('../_helpers');
const passport = require('../config/passport');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const tweetController = require('../controllers/tweetController');
const replyController = require('../controllers/replyController');
const multer = require('multer');
const upload = multer({
  dest: 'temp/',
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('請上傳 jpg / jpeg / png 格式的圖片'));
    }
    cb(null, true);
  },
});

//一般使用者認證
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next();
  }
  res.redirect('/signin');
};

// 管理員認證
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role.match('admin')) {
      return next();
    }
    res.redirect('/signin');
  }
};
const blockAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).role.match('admin')) {
      return next();
    }
    res.redirect('/admin/tweets');
  }
};
// router.get('/', authenticated, (req, res) => {
//   res.redirect('/tweets');
// });
// router.get('/tweets', authenticated, tweetController.getTweets);

// 註冊&登入
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);
router.get('/signin', userController.signInPage);
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true,
  }),
  userController.signIn
);

// 推文 -- Liv
router.get('/', authenticated, blockAdmin, (req, res) => {
  res.redirect('/tweets');
});
router.get('/tweets', authenticated, blockAdmin, tweetController.getTweets);
router.get('/tweets/:id', authenticated, blockAdmin, tweetController.getTweet);
router.post('/tweets', authenticated, blockAdmin, tweetController.postTweet);
router.put('/tweets/:id', authenticated, blockAdmin, tweetController.putTweet);
router.delete(
  '/tweets/:id',
  authenticated,
  blockAdmin,
  tweetController.deleteTweet
);
router.post('/tweets/:id/addLike', authenticated, blockAdmin, userController.addlike)
router.delete('/tweets/:id/removeLike', authenticated, blockAdmin, userController.removelike)
// router.get('/', (req, res) => {
//   res.redirect('/tweets');
// });
// router.get('/tweets', tweetController.getTweets);
// router.get('/tweets/:id', tweetController.getTweet);
// router.post('/tweets', tweetController.postTweet);
// router.put('/tweets/:id', tweetController.putTweet);
// router.delete('/tweets/:id', tweetController.deleteTweet);

// 回覆 -- Liv
router.post(
  '/tweets/:id/replies',
  authenticated,
  blockAdmin,
  replyController.postReply
);
// router.post('/tweets/:id/replies', replyController.postReply);

//管理員控制 -- 心憲
router.get('/admin/signin', adminController.signinPage);
router.post(
  '/admin/signin',
  passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true,
  }),
  adminController.signin
);
router.get('/admin/tweets', authenticatedAdmin, adminController.tweetsPage);
router.get('/admin/users', authenticatedAdmin, adminController.usersPage);
router.delete(
  '/admin/tweets/:id',
  authenticatedAdmin,
  adminController.deleteTweet
);

// 使用者
router.get('/users/:id', authenticated, blockAdmin, userController.getUser);
// 使用者 profile
router.get(
  '/users/:id/edit',
  authenticated,
  blockAdmin,
  userController.getUserEdit
);
router.put(
  '/users/:id/edit',
  authenticated,
  blockAdmin,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
  ]),
  userController.putUserEdit
);
router.get(
  '/users/:id/likes',
  authenticated,
  blockAdmin,
  userController.getUserLikes
);
router.get(
  '/users/:id/repliesList',
  authenticated,
  blockAdmin,
  userController.getRepliesAndTweets
);

// 使用者 information
router.get(
  '/users/:id/setting',
  authenticated,
  blockAdmin,
  userController.getUserSetting
);
router.put(
  '/users/:id/setting',
  authenticated,
  blockAdmin,
  userController.putUserSetting
);

// 使用者 followShip
router.get(
  '/users/:id/followers',
  authenticated,
  blockAdmin,
  userController.getSuggestFollower,
  userController.getfollowers
);
router.get(
  '/users/:id/following',
  authenticated,
  blockAdmin,
  userController.getSuggestFollower,
  userController.getfollowing
)
router.post(
  '/users/:id/addFollow',
  authenticated,
  blockAdmin,
  userController.addFollowing
);
router.delete(
  '/users/:id/removeFollow',
  authenticated,
  blockAdmin,
  userController.removeFollowing
);

// 登出
router.get('/logout', userController.logOut);

module.exports = router;
