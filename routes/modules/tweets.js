// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const tweetController = require("../../controllers/tweetController");
const likeController = require("../../controllers/likeController");
const router = express.Router();
const db = require("../../models");
//因題目需求 此路徑已全更改為/tweets/
router.get("/", tweetController.getPosts);
router.get("/:id", tweetController.getPost);
router.post("/", tweetController.postTweet); //有做修改： /posts ==> /add (這樣整個路由會變成 /posts/add，比較符合Restful)
router.put("/:id/like", likeController.changeLike);

module.exports = router;
