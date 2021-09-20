// This modules is for follows and likes
const express = require("express");
const followshipController = require("../../controllers/followshipController");
const router = express.Router();
const db = require("../../models");

router.get("/profile/:userId/followers", followshipController.getFollowers);
router.get("/profile/:userId/followings", followshipController.getFollowings);
router.post("/followers/:userFollowedId", followshipController.postFollowers);
router.delete(
  "/followers/:userFollowedId",
  followshipController.deleteFollowers
);

module.exports = router;
