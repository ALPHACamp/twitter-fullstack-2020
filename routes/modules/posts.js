// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const tweetController = require("../../controllers/tweetController");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

// router.get("/", (req, res) => {
//   return res.render("index");
// });
router.get("/" , tweetController.getPosts)
router.get("/:id", tweetController.getPost)
router.post("/posts", tweetController.postTweet)

module.exports = router;
