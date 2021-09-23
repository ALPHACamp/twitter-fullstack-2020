// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const followshipController = require("../../controllers/followshipController");
const userController = require("../../controllers/userController");
const profileController = require("../../controllers/profileController");
const tweetController = require("../../controllers/tweetController");
const router = express.Router();

router.get("/:userId/main", tweetController.getPosts);
router.get("/:userId/posts", profileController.getPosts);
router.get("/:userId/comments", profileController.getComments);
router.get("/:userId/likedPosts", profileController.getLikedPosts);
router.get("/:userId/followers", followshipController.getFollowers);
router.get("/:userId/followings", followshipController.getFollowings);

router.put("/:userId", (req, res) => {
  return res.redirect("back");
});
router.post("/:userId/notification", (req, res) => {
  return res.redirect("back");
});
router.delete("/:userId/notification", (req, res) => {
  return res.redirect("back");
});

module.exports = router;
