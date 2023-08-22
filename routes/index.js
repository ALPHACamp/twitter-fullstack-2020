const express = require("express");
const tweetsController = require("../controllers/tweets-controller");
const userController = require("../controllers/user-controller");
const router = express.Router();

router.get("/tweets", tweetsController.getTweets);
router.post("/tweets", tweetsController.postTweet);

router.post("/users/:followingUserId/follow", userController.postFollow);

module.exports = router;
