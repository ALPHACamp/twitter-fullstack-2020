const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const upload = require("../middleware/multer");

const tweetsController = require('../controllers/tweets-controller')
const userController = require('../controllers/user-controller')
const replyController = require('../controllers/reply-controller')
const likesController = require('../controllers/likes-controller')
const apiController = require('../controllers/api-controller')

const { authenticated, authenticatedAdmin } = require("../middleware/auth");
const { generalErrorHandler } = require("../middleware/error-handler");
const admin = require("./modules/admin");

router.use("/admin", admin);

router.get("/signup", userController.signupPage);
router.post("/signup", userController.signup);
router.get("/signin", userController.signinPage);
router.post(
  "/signin",
  passport.authenticate("local", { failureRedirect: "/signin" }),
  userController.sigin
);
router.get("/logout", userController.logout);
router.get("/tweets", authenticated, tweetsController.getTweets);
router.post("/tweets", authenticated, tweetsController.postTweet);
router.get("/tweets/:id/replies", authenticated, tweetsController.getTweet);
router.post(
  "/followships",
  authenticated,
  userController.postFollow
);
router.delete(
  "/followships/:followingUserId",
  authenticated,
  userController.deleteFollow
);
router.post("/tweets/:id/like", authenticated, tweetsController.addLike);
router.post(
  "/tweets/:id/unlike",
  authenticated,
  tweetsController.postUnlike
);
router.post(
  "/tweets/:id/replies",
  authenticated,
  tweetsController.postReply
);
router.get(
  "/tweets/more",
  tweetsController.getMoreTweets
);
router.get("/tweets", authenticated, tweetsController.getTweets);
router.post("/tweets", authenticated, tweetsController.postTweet);
router.post("/users/:followingUserId/follow", userController.postFollow);

router.get("/users/:id/tweets", authenticated, userController.getUser);
router.get("/users/:id/replies", authenticated, replyController.getReplies);
router.get("/users/:id/likes", authenticated, likesController.getLikes);
router.get("/users/:id/followers", authenticated, userController.getFollower);
router.get("/users/:id/followings", authenticated, userController.getFollowing);
router.get('/api/users/:id', authenticated, apiController.getUser)
router.post('/api/users/:id', upload.fields([{ name: 'background', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), authenticated, apiController.putUser)
router.post('/api/image', upload.fields([
  { name: 'background' },
  { name: 'avatar' }
]), authenticated, apiController.uploadImage)
router.get("/settings", authenticated, userController.getSetting); // 個人資料設定
router.put("/settings", authenticated, userController.putSetting); // 個人資料編輯
router.use('/', (req, res) => res.redirect('/tweets'));
router.use("/", generalErrorHandler);

module.exports = router;
