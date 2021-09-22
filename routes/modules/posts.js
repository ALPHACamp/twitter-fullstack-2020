// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const tweetController = require("../../controllers/tweetController");
const likeController = require("../../controllers/likeController");
const router = express.Router();
const db = require("../../models")

router.get("/:id/main" , tweetController.getPosts)
router.get("/:id", tweetController.getPost)
router.post("/posts", tweetController.postTweet)
router.put("/:id/like", likeController.changeLike)


module.exports = router;
