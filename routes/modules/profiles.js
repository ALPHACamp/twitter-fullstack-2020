// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const followshipController = require("../../controllers/followshipController");
const userController = require("../../controllers/userController");
const router = express.Router();

router.get("/:userId/main", (req, res) => {
  return res.render("index");
});
router.get("/:userId/posts", (req, res) => {
  return res.render("indexp");
});
router.get("/:userId/comments", (req, res) => {
  return res.render("index");
});
router.get("/:userId/likes", (req, res) => {
  return res.render("index");
});
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
