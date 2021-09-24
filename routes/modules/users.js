// This modules is for user and profile routers
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;
const userController = require("../../controllers/userController")
const followshipController = require("../../controllers/followshipController");
const profileController = require("../../controllers/profileController");

router.get("/signout", userController.signOut);

router.get("/:id/tweets", profileController.getPosts);
router.get("/:id/comments", profileController.getComments);
router.get("/:id/likes", profileController.getLikedPosts);
router.get("/:id/followers", followshipController.getFollowers);
router.get("/:id/followings", followshipController.getFollowings);
// router.get("/:id/edit")  測試需求路由,不過測試檔名稱怪怪的
// router.post("/:id/edit")

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
