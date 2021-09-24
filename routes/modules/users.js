// This modules is for user and profile routers
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;
const userController = require("../../controllers/userController")
const followshipController = require("../../controllers/followshipController");
const profileController = require("../../controllers/profileController");
const tweetController = require("../../controllers/tweetController");

router.get("/signout", userController.signOut);
//尚未使用
// router.get("/profile", (req, res) => {
//   return res.render("profile");
// });
// router.get("/:id/edit", (req, res) => {
//   return res.render("setting");
// });
// router.put("/:id", (req, res) => {
//   //revise account setting
// });
// router.get("/:id/main", (req, res) => {
//   return res.render("index");
// });
// router.get("/", (req, res) => {
//   return res.redirect(`users/${req.user.id}/main`);
// });

router.get("/:id/tweets", profileController.getPosts);
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
