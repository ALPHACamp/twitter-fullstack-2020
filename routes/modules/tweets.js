// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const tweetController = require("../../controllers/tweetController");
const likeController = require("../../controllers/likeController");
const router = express.Router();
const db = require("../../models");
//因題目需求 此路徑已全更改為/tweets/
router.get("/", tweetController.getPosts);
router.get("/:id", tweetController.getPost);
router.post("/", tweetController.postTweet);
router.put("/:id/like", likeController.changeLike);
router.get("/:id/replies", tweetController.postReply);
router.post("/:id/replies", tweetController.postReply);

module.exports = router;
